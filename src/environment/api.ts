import { Badger } from "../badge/api";
import { GitHubLoader } from "../loading/api";
import { CrossScriptMessenger } from "../messaging/api";
import { Store } from "../storage/api";
import { TabOpener } from "../tabs/api";

export interface Context {
  store: Store;
  githubLoader: GitHubLoader;
  badger: Badger;
  messenger: CrossScriptMessenger;
  tabOpener: TabOpener;
  getCurrentTime(): number;
  isOnline(): boolean;
}
