import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {

    window.scrollTo(0, 0);

    const timeoutId = setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
