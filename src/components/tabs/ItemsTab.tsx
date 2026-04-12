import type { UPRSettings, FieldItemsMod, ShopItemsMod } from "@/types/settings";
import type { RomProfile } from "@/lib/romDetection";
import { Tooltip } from "@/components/Tooltip";
import { tooltips } from "@/lib/tooltips";

interface Props {
  s: UPRSettings;
  set: <K extends keyof UPRSettings>(key: K, value: UPRSettings[K]) => void;
  rom: RomProfile | null;
}

export function ItemsTab({ s, set, rom }: Props) {
  const hasShopRandomization = rom?.hasShopRandomization ?? true;
  const hasPickupItems = (rom?.generation ?? 3) >= 3;
  return (
    <div className="flex flex-col gap-0">

      <div className="panel">
        <span className="panel-title">Field Items<Tooltip text={tooltips.fieldItemsMod} /></span>
        <div className="field-row mb-1">
          {([["UNCHANGED", "Unchanged"], ["SHUFFLE", "Shuffle"], ["RANDOM", "Random"], ["RANDOM_EVEN", "Random (Even Distribution)"]] as [FieldItemsMod, string][]).map(([m, label]) => (
            <span key={m} className="radio-label">
              <input type="radio" name="fieldItems" checked={s.fieldItemsMod === m}
                onChange={() => set("fieldItemsMod", m)} />
              {label}
            </span>
          ))}
        </div>
        {s.fieldItemsMod !== "UNCHANGED" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.banBadRandomFieldItems}
                onChange={e => set("banBadRandomFieldItems", e.target.checked)} />
              Ban Bad Items<Tooltip text={tooltips.banBadRandomFieldItems} />
            </span>
          </div>
        )}
      </div>

      <div className="panel">
        <span className="panel-title">Shop Items<Tooltip text={tooltips.shopItemsMod} /></span>
        {!hasShopRandomization && <p className="text-sm text-gray-500 mb-2">This ROM does not support shop randomization.</p>}
        <div className="field-row mb-1">
          {([["UNCHANGED", "Unchanged"], ["SHUFFLE", "Shuffle"], ["RANDOM", "Random"]] as [ShopItemsMod, string][]).map(([m, label]) => (
            <span key={m} className="radio-label">
              <input type="radio" name="shopItems" disabled={!hasShopRandomization} checked={s.shopItemsMod === m}
                onChange={() => set("shopItemsMod", m)} />
              {label}
            </span>
          ))}
        </div>
        {s.shopItemsMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banBadRandomShopItems}
                  onChange={e => set("banBadRandomShopItems", e.target.checked)} />
                Ban Bad Items<Tooltip text={tooltips.banBadRandomShopItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banRegularShopItems}
                  onChange={e => set("banRegularShopItems", e.target.checked)} />
                Ban Regular Shop Items<Tooltip text={tooltips.banRegularShopItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.banOPShopItems}
                  onChange={e => set("banOPShopItems", e.target.checked)} />
                Ban Overpowered Items<Tooltip text={tooltips.banOPShopItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.balanceShopPrices}
                  onChange={e => set("balanceShopPrices", e.target.checked)} />
                Balance Shop Prices<Tooltip text={tooltips.balanceShopPrices} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.guaranteeEvolutionItems}
                  onChange={e => set("guaranteeEvolutionItems", e.target.checked)} />
                Guarantee Evolution Items<Tooltip text={tooltips.guaranteeEvolutionItems} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.guaranteeXItems}
                  onChange={e => set("guaranteeXItems", e.target.checked)} />
                Guarantee X Items<Tooltip text={tooltips.guaranteeXItems} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <span className="panel-title">Pickup Items<Tooltip text={tooltips.pickupItemsMod} /></span>
        {!hasPickupItems && <p className="text-sm text-gray-500 mb-2">This ROM does not support Pickup item randomization.</p>}
        <div className="field-row mb-1">
          <span className="radio-label">
            <input type="radio" name="pickupMod" disabled={!hasPickupItems} checked={s.pickupItemsMod === "UNCHANGED"}
              onChange={() => set("pickupItemsMod", "UNCHANGED")} />
            Unchanged
          </span>
          <span className="radio-label">
            <input type="radio" name="pickupMod" disabled={!hasPickupItems} checked={s.pickupItemsMod === "RANDOM"}
              onChange={() => set("pickupItemsMod", "RANDOM")} />
            Random
          </span>
        </div>
        {s.pickupItemsMod === "RANDOM" && (
          <div className="sub-options">
            <span className="checkbox-label">
              <input type="checkbox" checked={s.banBadRandomPickupItems}
                onChange={e => set("banBadRandomPickupItems", e.target.checked)} />
              Ban Bad Items<Tooltip text={tooltips.banBadRandomPickupItems} />
            </span>
          </div>
        )}
      </div>

      <div className="panel">
        <span className="panel-title">In-Game Trades<Tooltip text={tooltips.inGameTradesMod} /></span>
        <div className="field-row mb-1">
          <span className="radio-label">
            <input type="radio" name="tradesMod" checked={s.inGameTradesMod === "UNCHANGED"}
              onChange={() => set("inGameTradesMod", "UNCHANGED")} />
            Unchanged
          </span>
          <span className="radio-label">
            <input type="radio" name="tradesMod" checked={s.inGameTradesMod === "RANDOMIZE_GIVEN"}
              onChange={() => set("inGameTradesMod", "RANDOMIZE_GIVEN")} />
            Randomize Given
          </span>
          <span className="radio-label">
            <input type="radio" name="tradesMod" checked={s.inGameTradesMod === "RANDOMIZE_GIVEN_AND_REQUESTED"}
              onChange={() => set("inGameTradesMod", "RANDOMIZE_GIVEN_AND_REQUESTED")} />
            Randomize Given &amp; Requested
          </span>
        </div>
        {s.inGameTradesMod !== "UNCHANGED" && (
          <div className="sub-options">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeInGameTradesNicknames}
                  onChange={e => set("randomizeInGameTradesNicknames", e.target.checked)} />
                Randomize Nicknames<Tooltip text={tooltips.randomizeInGameTradesNicknames} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeInGameTradesOTs}
                  onChange={e => set("randomizeInGameTradesOTs", e.target.checked)} />
                Randomize OTs<Tooltip text={tooltips.randomizeInGameTradesOTs} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeInGameTradesIVs}
                  onChange={e => set("randomizeInGameTradesIVs", e.target.checked)} />
                Randomize IVs<Tooltip text={tooltips.randomizeInGameTradesIVs} />
              </span>
              <span className="checkbox-label">
                <input type="checkbox" checked={s.randomizeInGameTradesItems}
                  onChange={e => set("randomizeInGameTradesItems", e.target.checked)} />
                Randomize Held Items<Tooltip text={tooltips.randomizeInGameTradesItems} />
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
