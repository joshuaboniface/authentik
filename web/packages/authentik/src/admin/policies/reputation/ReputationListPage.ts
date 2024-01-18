import { DEFAULT_CONFIG } from "@goauthentik/common/api/config.js";
import { uiConfig } from "@goauthentik/common/ui/config.js";
import "@goauthentik/elements/buttons/ModalButton.js";
import "@goauthentik/elements/buttons/SpinnerButton/ak-spinner-button.js";
import "@goauthentik/elements/forms/DeleteBulkForm.js";
import "@goauthentik/elements/forms/ModalForm.js";
import "@goauthentik/elements/rbac/ObjectPermissionModal.js";
import { PaginatedResponse } from "@goauthentik/elements/table/Table.js";
import { TableColumn } from "@goauthentik/elements/table/Table.js";
import { TablePage } from "@goauthentik/elements/table/TablePage.js";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { msg } from "@lit/localize";
import { TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
    PoliciesApi,
    RbacPermissionsAssignedByUsersListModelEnum,
    Reputation,
} from "@goauthentik/api";

@customElement("ak-policy-reputation-list")
export class ReputationListPage extends TablePage<Reputation> {
    searchEnabled(): boolean {
        return true;
    }
    pageTitle(): string {
        return msg("Reputation scores");
    }
    pageDescription(): string {
        return msg(
            "Reputation for IP and user identifiers. Scores are decreased for each failed login and increased for each successful login.",
        );
    }
    pageIcon(): string {
        return "fa fa-ban";
    }

    @property()
    order = "identifier";

    checkbox = true;

    async apiEndpoint(page: number): Promise<PaginatedResponse<Reputation>> {
        return new PoliciesApi(DEFAULT_CONFIG).policiesReputationScoresList({
            ordering: this.order,
            page: page,
            pageSize: (await uiConfig()).pagination.perPage,
            search: this.search || "",
        });
    }

    columns(): TableColumn[] {
        return [
            new TableColumn(msg("Identifier"), "identifier"),
            new TableColumn(msg("IP"), "ip"),
            new TableColumn(msg("Score"), "score"),
            new TableColumn(msg("Updated"), "updated"),
            new TableColumn(msg("Actions")),
        ];
    }

    renderToolbarSelected(): TemplateResult {
        const disabled = this.selectedElements.length < 1;
        return html`<ak-forms-delete-bulk
            objectLabel=${msg("Reputation")}
            .objects=${this.selectedElements}
            .usedBy=${(item: Reputation) => {
                return new PoliciesApi(DEFAULT_CONFIG).policiesReputationScoresUsedByList({
                    reputationUuid: item.pk || "",
                });
            }}
            .delete=${(item: Reputation) => {
                return new PoliciesApi(DEFAULT_CONFIG).policiesReputationScoresDestroy({
                    reputationUuid: item.pk || "",
                });
            }}
        >
            <button ?disabled=${disabled} slot="trigger" class="pf-c-button pf-m-danger">
                ${msg("Delete")}
            </button>
        </ak-forms-delete-bulk>`;
    }

    row(item: Reputation): TemplateResult[] {
        return [
            html`${item.identifier}`,
            html`${item.ipGeoData?.country
                ? html` ${getUnicodeFlagIcon(item.ipGeoData.country)} `
                : html``}
            ${item.ip}`,
            html`${item.score}`,
            html`${item.updated.toLocaleString()}`,
            html`
                <ak-rbac-object-permission-modal
                    model=${RbacPermissionsAssignedByUsersListModelEnum.PoliciesReputationReputation}
                    objectPk=${item.pk || ""}
                >
                </ak-rbac-object-permission-modal>
            `,
        ];
    }
}
