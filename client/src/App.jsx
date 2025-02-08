import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' 
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage'
import PublicLists from './pages/PublicLists';
import PrivateList from './pages/PrivateList';
import ErrorPage from './pages/ErrorPage';
import Review from './components/Private/Review';
import ListConfrim from './components/Private/ListConfirm';
import AdminPage from './pages/AdminPage';
import VerifyModal from './components/Auth/VerifyModal';
import SecurityPrivacyPolicy from './components/Policy/SecurityPrivacyPolicy';
import DMCAPolicy from './components/Policy/DCMAPolicy';
import AcceptableUsePolicy from './components/Policy/AcceptableUsePolicy';
import ListEdit from './components/Private/ListEdit';
import ExistingList from './components/Private/ExistingList';

function App() {
  return (
    <>
      <Header />
      <div>
      <Routes>
        <Route path="/" element={ <HomePage />}/>
        <Route path="/security-privacy-policy" element={<SecurityPrivacyPolicy />} />
        <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
        <Route path="/dmca-policy" element={<DMCAPolicy />} />
        <Route path="/search" element={<SearchPage />}/>
        <Route path="/list" element={<PublicLists />}/>
        <Route path="/auth-list" element={<PrivateList />}/>
        <Route path="/edit-list" element={<ListEdit />}/>
        <Route path="/error" element={<ErrorPage />}/>
        <Route path="/add-review" element={<Review />}/>
        <Route path="/confirm-list" element={<ListConfrim />}/>
        <Route path="/admin-page" element={<AdminPage />}/>
        <Route path="/verify-email" element={<VerifyModal />}/>
        <Route path="/existing-list" element={<ExistingList />}/>
      </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
