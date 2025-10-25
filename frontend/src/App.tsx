import './App.css';
import Calculator from './Calculator';

export default function App() {
  const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;
  if (!API_BASE_URL) return <div>Error: VITE_API_BASE_URL が見つかりません。</div>
  return  (
    <Calculator/>
  )
}
