import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

// Компонет для отслеживания аналитики
function Analytics() {
  const router = useRouter();
  
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Здесь можно добавить Google Analytics или другую аналитику
      console.log('App is changing to: ', url);
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events]);

  return null;
}

// Компонент для обработки ошибок
function ErrorHandler({ error }) {
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="cyber-text text-2xl mb-4">Something went wrong!</h2>
          <p className="text-white/60">{error.message}</p>
        </div>
      </div>
    );
  }
  return null;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Глобальные мета-теги */}
      <style jsx global>{`
        /* Дополнительные глобальные стили которые не вошли в CSS */
        .text-shadow-glow {
          text-shadow: 0 0 10px currentColor;
        }
        
        /* Улучшенная поддержка анимаций */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Компонент аналитики */}
      <Analytics />
      
      {/* Основной компонент страницы */}
      <Component {...pageProps} />
    </>
  );
}

// Обработка ошибок на уровне приложения
MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    try {
      pageProps = await Component.getInitialProps(ctx);
    } catch (error) {
      console.error('Error in getInitialProps:', error);
      pageProps = { error };
    }
  }

  return { pageProps };
};
