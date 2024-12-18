type EventDataType = Record<string | number | symbol, any>;
type EventIdUnionType<ED extends EventDataType> = keyof ED;
type CallBackType<ED extends EventDataType, EI extends EventIdUnionType<ED>> = (
  data: ED[EI]
) => any;
type ListenerDataType<
  ED extends EventDataType,
  EI extends EventIdUnionType<ED>
> = {
  id: EI;
  callback?: CallBackType<ED, EI>;
  description?: string;
};

const isValidId = (id: any) => {
  if (['string', 'number', 'symbol'].includes(typeof id)) return true;
  return false;
};

class EventListener<ED extends EventDataType = any> {
  private name?: string;
  private isDebug?: boolean;
  private LISTENER_DATA: {
    [K in EventIdUnionType<ED>]?: ListenerDataType<ED, K>;
  };
  constructor(name?: string, isDebug?: boolean) {
    this.name = name;
    this.isDebug = isDebug;
    this.LISTENER_DATA = {};
  }

  addListener<EI extends EventIdUnionType<ED>>(
    id: EI,
    callback: CallBackType<ED, EI>,
    description?: string
  ) {
    if (!isValidId(id) || (callback && typeof callback !== 'function')) return;
    this.LISTENER_DATA[id] = {
      id,
      callback,
      description,
    };
    if (!!this.isDebug) {
      console.log(
        `${this.name} - Add listener (∑${Object.keys(this.LISTENER_DATA).length
        }): `,
        id
      );
    }
    return id;
  }

  removeListener<EI extends EventIdUnionType<ED>>(id?: EI) {
    if (!id || !isValidId(id) || !(id in this.LISTENER_DATA)) return false;
    delete this.LISTENER_DATA[id];
    if (!!this.isDebug) {
      console.log(
        `${this.name} - Remove listener (∑${Object.keys(this.LISTENER_DATA).length
        }): `,
        id
      );
    }
    return true;
  }

  removeAllListeners() {
    this.LISTENER_DATA = {};
    if (!!this.isDebug) {
      console.log(
        `${this.name} - Remove ALL listener (∑${Object.keys(this.LISTENER_DATA).length
        })`
      );
    }
  }

  emitListener<EI extends EventIdUnionType<ED>>(id: EI, data: ED[EI]) {
    if (!(id in this.LISTENER_DATA)) return;
    if (!!this.isDebug) {
      console.log(
        `${this.name} - Emit listener (∑${Object.keys(this.LISTENER_DATA).length
        }): `,
        id
      );
    }
    return this.LISTENER_DATA[id]?.callback?.(data);
  }

  getListenerList() {
    return Object.values(this.LISTENER_DATA).map((el) => {
      if (!el) return undefined;
      return {
        id: el.id,
        description: el.description,
      };
    });
  }

  on = this.addListener;
  emit = this.emitListener;
  rm = this.removeListener;
  rmAll = this.removeAllListeners;

  emitPromise<EI extends EventIdUnionType<ED>>(
    id: EI,
    data: Omit<ED[EI], 'cb' | 'rj' | 'callback' | 'reject'>,
  ) {
    type R = Parameters<ED[EI]['callback']>[0] | Parameters<ED[EI]['cb']>[0];
    return new Promise<R>((resolve, reject) => {
      this.emitListener(id, {
        ...(data as ED[EI]),
        cb: resolve,
        rj: reject,
      });
    });
  }
}

export default EventListener;
