import { DEFAULT_CONFIG } from "@goauthentik/common/api/config.js";
import "@goauthentik/elements/chips/Chip.js";
import "@goauthentik/elements/chips/ChipGroup.js";
import "@goauthentik/elements/forms/HorizontalFormElement.js";
import { ModelForm } from "@goauthentik/elements/forms/ModelForm.js";
import "@goauthentik/elements/forms/SearchSelect/ak-search-select.js";

import { msg } from "@lit/localize";
import { TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { RbacApi, Role } from "@goauthentik/api";

@customElement("ak-role-form")
export class RoleForm extends ModelForm<Role, string> {
    loadInstance(pk: string): Promise<Role> {
        return new RbacApi(DEFAULT_CONFIG).rbacRolesRetrieve({
            uuid: pk,
        });
    }

    getSuccessMessage(): string {
        return this.instance
            ? msg("Successfully updated role.")
            : msg("Successfully created role.");
    }

    async send(data: Role): Promise<Role> {
        if (this.instance?.pk) {
            return new RbacApi(DEFAULT_CONFIG).rbacRolesPartialUpdate({
                uuid: this.instance.pk,
                patchedRoleRequest: data,
            });
        } else {
            return new RbacApi(DEFAULT_CONFIG).rbacRolesCreate({
                roleRequest: data,
            });
        }
    }

    renderForm(): TemplateResult {
        return html`<ak-form-element-horizontal label=${msg("Name")} ?required=${true} name="name">
            <input
                type="text"
                value="${ifDefined(this.instance?.name)}"
                class="pf-c-form-control"
                required
            />
        </ak-form-element-horizontal>`;
    }
}
