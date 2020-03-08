export interface StateGm {
  model: {
    code: string;
    description: string;
    details: CodeDescription[];
  };
  visibleModify: boolean;
}

export interface CodeDescription {
  code: string;
  description: string;
}
