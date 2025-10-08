/**
 * Simple site testing utilities
 */

export const testSiteFunctionality = () => {
  console.log('🧪 Testing site functionality...');
  
  // Test localStorage
  try {
    localStorage.setItem('test', 'value');
    const retrieved = localStorage.getItem('test');
    localStorage.removeItem('test');
    console.log('✅ localStorage: Working');
  } catch (error) {
    console.error('❌ localStorage: Failed', error);
  }
  
  // Test fetch API
  fetch('http://localhost:8000/health')
    .then(response => response.json())
    .then(data => {
      console.log('✅ Backend API: Working', data);
    })
    .catch(error => {
      console.warn('⚠️ Backend API: Not available', error.message);
    });
  
  // Test React components
  const rootElement = document.getElementById('root');
  if (rootElement && rootElement.children.length > 0) {
    console.log('✅ React: Components rendered');
  } else {
    console.error('❌ React: No components rendered');
  }
  
  console.log('🧪 Site testing completed');
};

// Auto-run test if in development
if (import.meta.env.DEV) {
  setTimeout(testSiteFunctionality, 2000);
}
