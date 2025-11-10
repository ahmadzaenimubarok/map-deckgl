import DeckMap from '../Components/DeckMap';
import AppLayout from '../Layouts/AppLayout';

export default function MapPlayground() {
  return (
    <AppLayout>
      <h1 className="text-xl font-bold">Deck.gl Playground</h1>
      <DeckMap />
    </AppLayout>
  );
}