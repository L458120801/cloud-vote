import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import VotePoll from './pages/VotePoll';
import PollResult from './pages/PollResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/vote/:id" element={<VotePoll />} />
        <Route path="/result/:id" element={<PollResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
