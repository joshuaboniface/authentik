import { AKElement } from "@goauthentik/elements/Base.js";
import { Chip } from "@goauthentik/elements/chips/Chip.js";

import { CSSResult, TemplateResult, css, html } from "lit";
import { property } from "lit/decorators.js";

import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFChip from "@patternfly/patternfly/components/Chip/chip.css";
import PFChipGroup from "@patternfly/patternfly/components/ChipGroup/chip-group.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

import { registerCustomElement } from "../utils/customElement";

export class ChipGroup extends AKElement {
    static get styles(): CSSResult[] {
        return [
            PFBase,
            PFChip,
            PFChipGroup,
            PFButton,
            css`
                ::slotted(*) {
                    margin: 0 2px;
                }
                .pf-c-chip-group {
                    margin-bottom: 8px;
                }
            `,
        ];
    }

    @property()
    name?: string;

    set value(v: (string | number | undefined)[]) {
        return;
    }

    get value(): (string | number | undefined)[] {
        const values: (string | number | undefined)[] = [];
        this.querySelectorAll<Chip>("ak-chip").forEach((chip) => {
            values.push(chip.value);
        });
        return values;
    }

    render(): TemplateResult {
        return html`<div class="pf-c-chip-group">
            <div class="pf-c-chip-group__main">
                <ul class="pf-c-chip-group__list" role="list">
                    <slot></slot>
                </ul>
            </div>
        </div>`;
    }
}

registerCustomElement("ak-chip-group", ChipGroup);
