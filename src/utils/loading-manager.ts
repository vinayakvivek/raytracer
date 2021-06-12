export interface LoadingItem {
  name: string;
  loaded: boolean;
}

type OnProgressCallback = (
  item?: string,
  loaded?: number,
  total?: number
) => void;
type OnLoadCallback = (total?: number) => void;

export class LoadingManager {
  items: LoadingItem[] = [];
  onProgress: OnProgressCallback;
  onLoad: OnLoadCallback;
  loaded: number = 0;
  total: number = 0;
  isLoading = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.items = [];
    this.isLoading = false;
    this.loaded = 0;
    this.total = 0;
    this.onProgress = () => {};
    this.onLoad = () => {};
  }

  addItem(name: string): number {
    this.isLoading = true;
    const id = this.total;
    this.items.push({
      name,
      loaded: false,
    });
    this.total++;
    return id;
  }

  itemLoaded(id: number) {
    if (id >= this.items.length) {
      console.error(
        `[LoadingManager] Invalid id: ${id}, current num items: ${this.items.length}`
      );
      return;
    }
    const item = this.items[id];
    item.loaded = true;
    this.loaded++;
    this.onProgress(item.name, this.loaded, this.total);
    this.checkLoading();
  }

  checkLoading() {
    if (this.loaded === this.total) {
      // finished loading
      this.isLoading = false;
      this.onLoad(this.total);
    }
  }
}
