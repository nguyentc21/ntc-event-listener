# ntc-event-listener

A simple Event Listener for JavaScript projects

## Installation

```sh
yarn add ntc-event-listener
```

## Usage

| Method                   | Return                                                 | description                     |
|--------------------------|--------------------------------------------------------|---------------------------------|
| addListener on           | EventId \| undefined                                   | return undefined means error    |
| removeListener rm        | boolean                                                | true on success otherwise false |
| removeAllListeners rmAll | undefined                                              |                                 |
| emitListener emit        | any                                                    |                                 |
| getListenerList          | ({ id: EventId, description?: string } \| undefined)[] |                                 |                                    |

```tsx
import EventListener from 'ntc-event-listener';

type EventDataType = {
  'open-modal': ModalDataType;
  'open-toast': undefined;
  /// ...
};
const MyEventListener = new EventListener<EventDataType>();
export default MyEventListener;
```

```tsx
// ...
import MyEventListener from '../MyEventListener';
// ...

const MyToast = (props: Props) => {
  // ...
  useEffect(() => {
    // Add event listener "open-toast"
    MyEventListener.on('open-toast', (data) => {
      // ... Do "open-toast" action
    });
    () => {
      // Remove event listener "open-toast"
      MyEventListener.rm('open-toast');
    };
  }, []);
};
// ...

// ...
const OtherView = (props: Props) => {
  // ...
  const _openToast = () => {
    MyEventListener.emit('open-toast', 'Hello');
  };
};
// ...
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
