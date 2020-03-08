import { CodeDescription } from "../../generic-master/context/state-gm";

export interface StateI {
  model: {
    code: string;
    description: string;
    details: CodeDescription[];
  };
  visibleModify: boolean;
  visibleModifyItem: boolean;
}
