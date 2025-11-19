import { Command } from "./types";

export class CommandDispatcher {
  async dispatch(cmd: Command) {
    return cmd.execute();
  }
}
