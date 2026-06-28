import { useEffect } from 'react';

export function useSEO({ title, description }) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Web3 Explorer`;

    // Helper to find or create a meta tag
    const updateMetaTag = (attrName, attrValue, contentValue) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Update standard description tag
    updateMetaTag('name', 'description', description);

    // Update Open Graph tags for premium sharing embeds
    updateMetaTag('property', 'og:title', `${title} | Web3 Explorer`);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', 'Web3 Explorer');

    // Update Twitter Cards meta tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', `${title} | Web3 Explorer`);
    updateMetaTag('name', 'twitter:description', description);
  }, [title, description]);
}
