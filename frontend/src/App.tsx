import { useEffect, useState } from 'react';
import './App.css';
import { Keypad } from './components/Keypad';

function App() {
  const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    // API_BASE_URLが未定義ならエラーを返す。
    if (!API_BASE_URL) {
      setError("VITE_API_BASE_URL is not set");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    // アプリの起動メソッド。
    const run = async () => {
      try {
        const signal = controller.signal
        // signalを渡すと、のちにabort()でキャンセルできる。
        const res = await fetch(API_BASE_URL, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        // AbortErrorはエラーとしてキャッチしない。。想定済みのエラーのため。
        if (err instanceof Error && err.name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    // 進行中のfetchリクエストを強制的にキャンセルする。
    return () => controller.abort();
  }, [API_BASE_URL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  function handlePress() {

  }

  return (
    <div>
      <h1>API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* <Calculator/> */}
      <Keypad onPress={handlePress} disabled={isCalculating} />
      {/* <History/> */}
    </div>
  );
}

export default App;
