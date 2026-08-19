(async()=>{
  try{
    const response=await fetch("./exerciseDescriptions.json?v=180");
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const records=await response.json();
    window.TRENINGSBUDDY_EXERCISE_DETAILS=Object.fromEntries(records.map(record=>{
      const description=record.description||{};
      return [record.id,{
        start:description.startPosition||"",
        steps:Array.isArray(description.steps)?description.steps:[],
        breathing:description.breathing||"",
        technique:Array.isArray(description.technique)?description.technique:[],
        mistakes:(description.mistakes||[]).map(item=>item.correction?`Feil: ${item.mistake}\nKorrigering: ${item.correction}`:`Feil: ${item.mistake}`)
      }];
    }));
  }catch(error){
    window.TRENINGSBUDDY_EXERCISE_DETAILS={};
    console.warn("Øvelsesbeskrivelser kunne ikke lastes.",error);
  }finally{
    const script=document.createElement("script");
    script.src="./app.js?v=180";
    document.body.appendChild(script);
  }
})();
