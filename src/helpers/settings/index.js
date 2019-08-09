
import template from './dataStoreTemplate'


const saveDataStoreTemplate = async (url, apiVersion) => {

  if ( !url || !apiVersion || isNaN(apiVersion) ) {
    throw new Error(`Missing arguments url or apiVersion`)
  }

  const templateJsonString = JSON.stringify(template)

  const result = await fetch(`${url}api/${apiVersion}/dataStore/dataQualityTool/settings`, 
    {
      credentials: 'include', 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: templateJsonString
    })


  return result.ok ? template : null

}

export default async(url, apiVersion) => {
    const data = await fetch(`${url}api/${apiVersion}/dataStore/dataQualityTool/settings`, {credentials: 'include'})
  
    if ( !data.ok ) {
      if ( data.status === 404 ) {
        //this app has not been used on this instance before, we need to post a default config

        try {
          const json = saveDataStoreTemplate(url, apiVersion)
          return json
  
        } catch ( err ) {
          throw new Error(`Could not save settings template due to: ${err.message}`)
        }
      

      } else {
        throw new Error(`Could not load settings due to: ${data.statusText}`)
      }
    }
    return await data.json()
  }
  