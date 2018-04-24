import {State} from "./state.enum";
import {Scope} from "./scope.enum";

export class JavaComponent {
  id: String;
  name: String;
  state: State;
  scope: Scope;
  logMessages: String[];
}


