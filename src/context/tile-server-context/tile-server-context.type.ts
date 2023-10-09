type TileServer = {
  label: string,
  url: string
}

interface TileServerContextProps {
  tileServers: TileServer[];
  tileServer: TileServer;
}

type TileServerContextApi = {
  setServer: (index: number) => void,
  switchServer: () => void;
} & TileServerContextProps
