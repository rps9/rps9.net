import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Darts from './pages/Darts';
import Cricket from './pages/Cricket';
import X01 from './pages/X01';
import AboutMe from './pages/AboutMe';
import Resume from './pages/Resume';
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import SongRecommendations from './pages/SongRecommendations'
import OwnerControls from './pages/OwnerControls'
import ScrollToTop from "./components/ScrollToTop";

const PAGE_CANVAS = '#f6f3ed';
const HEADER_CANVAS = '#ffffff';
const FOOTER_CANVAS = '#000000';

function useOverscrollCanvas() {
  const location = useLocation();

  useEffect(() => {
    let frame = 0;

    const setCanvas = () => {
      frame = 0;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const hasFooter = Boolean(document.querySelector('[data-site-footer="true"]'));

      const color =
        scrollTop <= 2
          ? HEADER_CANVAS
          : hasFooter && maxScroll - scrollTop <= 2
            ? FOOTER_CANVAS
            : PAGE_CANVAS;

      document.documentElement.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
    };

    const scheduleCanvasUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(setCanvas);
    };

    setCanvas();
    window.addEventListener('scroll', scheduleCanvasUpdate, { passive: true });
    window.addEventListener('resize', scheduleCanvasUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleCanvasUpdate);
      window.removeEventListener('resize', scheduleCanvasUpdate);
      document.documentElement.style.backgroundColor = PAGE_CANVAS;
      document.body.style.backgroundColor = PAGE_CANVAS;
    };
  }, [location.pathname]);
}

export default function App() {
  useOverscrollCanvas();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/darts" element={<Darts />} />
        <Route path="/darts/cricket" element={<Cricket />} />
        <Route path="/darts/x01" element={<X01 />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/song-recs" element={<SongRecommendations />} />
        <Route path="/owner-controls" element={<OwnerControls />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
