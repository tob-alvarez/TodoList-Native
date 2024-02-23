// styles.js
export const getHeaderStyles = (darkMode) => {
    return {
      headerTintColor: darkMode ? 'white' : 'black',
      headerStyle: {
        backgroundColor: darkMode ? '#141414' : 'white',
      },
    };
  };
  