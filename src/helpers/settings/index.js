

export default async(url, apiVersion) => {
    const data = await fetch(`${url}api/${apiVersion}/dataStore/dataQualityTool/settings`, {credentials: 'include'})
  
    if ( !data.ok ) {
      if ( data.status === 404 ) {
        //this app has not been used on this instance before, we need to post a default config
        
        
      } else {
        throw new Error(`Could not load settings due to: ${data.statusText}`)
      }
    }
    return await data.json()
  }
  