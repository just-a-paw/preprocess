# Preprocessor

This library wraps the C++ preprocessor for easier use on any arbitrary code.

## Examples

```javascript
#define FAVOURITE_NUMBER 8
#define loop(n) for (let i; i < n; i++)

const arr = [];

loop(7) arr.push(i * 2);
loop(arr.length) console.log(FAVOURITE_NUMBER / arr[i]);
```

```typescript
class Client {
#ifdef _WIN32
  public isDisconnected(server: Server) {
    return this.hasQuit() || !server.clients.find(this);
  }
#else
  public isDisconnected() {
    return this.hasQuit() || !this.fetchServer().isActive;
  }
#endif
}
```