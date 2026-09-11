import { ChangeEvent, useEffect, useRef } from "react";
import ActionMenuItem from "ports/components/action-menu/ActionMenuItem.tsx";
import { createMenuConfig } from "ports/config/menu.config.ts";
import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import useCsvData from "ports/components/import-export/use-csv-data.ts";
import { csvRowsToMembers, memberToCSVRow } from "application/csv/member.csv.ts";
import { membersToGeoJSON } from "application/geojson/member.geojson.ts";
import { createGeoJSONFile } from "infrastructure/geojson/geojson.file.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { useTileServer } from "ports/context/tile-server/tile-server.hook.ts";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getRole } from "infrastructure/redux/auth/auth.selectors.ts";
import { getMemberImportResult, getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { clearImportResult, importMembersRequested } from "infrastructure/redux/member/member.slice.ts";
import { getOrganizations } from "infrastructure/redux/organization/organization.selectors.ts";
import "./action-menu.css";

export default function ActionMenu() {
  const dispatch = useDispatch();
  const { t, setLanguage } = useTranslation();
  const role = useSelector(getRole);
  const members = useSelector(getMembers);
  const organizations = useSelector(getOrganizations);
  const importResult = useSelector(getMemberImportResult);
  const { data, importCSVFile, exportCSVFile } = useCsvData();
  const { baseMaps, setSelectedBaseMap } = useTileServer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) return;
    dispatch(importMembersRequested({ members: csvRowsToMembers(data) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!importResult) return;
    if (importResult.failed > 0) {
      alert(t.importExport.importResult(importResult.success, importResult.total, importResult.failed));
    }
    dispatch(clearImportResult());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importResult]);

  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = target.files && target.files[0];
    if (!selectedFile) return;
    importCSVFile(selectedFile);
    target.value = "";
  };

  const menuConfig = createMenuConfig({
    dispatch,
    role,
    t,
    setLanguage,
    onImport: () => fileInputRef.current?.click(),
    onExportCsv: () => exportCSVFile(members.map(memberToCSVRow), "members.csv"),
    onExportGeoJson: () =>
      createGeoJSONFile(JSON.stringify(membersToGeoJSON(members), null, 2), "members.geojson"),
    members,
    organizations,
    baseMapNames: Object.keys(baseMaps),
    setSelectedBaseMap,
  });
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
