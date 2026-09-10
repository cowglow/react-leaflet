import { ChangeEvent, useEffect, useRef } from "react";
import ActionMenuItem from "ports/components/action-menu/ActionMenuItem.tsx";
import { createMenuConfig } from "ports/config/menu.config.ts";
import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import useCsvData from "ports/components/import-export/use-csv-data.ts";
import { csvRowsToMembers, memberToCSVRow } from "application/csv/member.csv.ts";
import { membersToGeoJSON } from "application/geojson/member.geojson.ts";
import { createGeoJSONFile } from "infrastructure/geojson/geojson.file.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getRole } from "infrastructure/redux/auth/auth.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { addMember, removeMember } from "infrastructure/redux/member/member.slice.ts";

export default function ActionMenu() {
  const dispatch = useDispatch();
  const { t, setLanguage } = useTranslation();
  const role = useSelector(getRole);
  const members = useSelector(getMembers);
  const { data, importCSVFile, exportCSVFile } = useCsvData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) return;
    const imported = csvRowsToMembers(data);

    (async () => {
      // Import replaces the directory wholesale: clear what's there, then
      // persist the imported set — both steps go through the real API so the
      // result survives a reload, same as every other member write.
      await Promise.allSettled(members.map((member) => dispatch(removeMember(member.id)).unwrap()));
      const results = await Promise.allSettled(
        imported.map((member) => dispatch(addMember(member)).unwrap()),
      );
      const failed = results.filter((result) => result.status === "rejected").length;
      if (failed > 0) {
        alert(t.importExport.importResult(imported.length - failed, imported.length, failed));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = target.files && target.files[0];
    if (!selectedFile) return;
    importCSVFile(selectedFile);
    target.value = "";
  };

  const menuConfig = createMenuConfig(
    dispatch,
    role,
    t,
    setLanguage,
    () => fileInputRef.current?.click(),
    () => exportCSVFile(members.map(memberToCSVRow), "members.csv"),
    () =>
      createGeoJSONFile(JSON.stringify(membersToGeoJSON(members), null, 2), "members.geojson"),
  );
  const topMenuNames = Object.keys(menuConfig);

  return (
    <ul role="menu-bar" className="standard-dialog">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={inputHandler}
      />
      {topMenuNames.map((menuName) => (
        <li
          key={`action-menu-key-${menuName}`}
          role="menu-item"
          tabIndex={0}
          aria-haspopup="true"
        >
          {menuName}
          <ul role="menu">
            {(menuConfig[menuName] as MenuConfigItem[]).map((config, index) => (
              <ActionMenuItem
                key={`action-menu-index-${index}`}
                config={config}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
