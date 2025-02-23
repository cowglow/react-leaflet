type REDUX_ACTION = string;

export type ActionMenuDescription = {
  label: string;
  action?: REDUX_ACTION;
  href?: string;
};

export type Divider = "---";
