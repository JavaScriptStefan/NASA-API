const API_URL = "http://localhost:8000";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  try{
    const response = await fetch(`${API_URL}/planets`);
    const planets = await response.json();
    console.log({planets});
    return planets;
  }catch(e){
    console.log(e);
  }
}

async function httpGetLaunches() { 
  // TODO: Once API is ready. 
  // Load launches, sort by flight number, and return as JSON.
  try{
    const response = await fetch(`${API_URL}/launches`);
    const launches = await response.json();
    console.log({launches});
    return launches;
  }catch(e){
    console.log(e);
  }
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.

  try{
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(launch)
    });
  }catch(e){
    return {
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    }); 
  }catch(e){
    console.log(e);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};