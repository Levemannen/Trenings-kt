(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.TreningsbuddyWorkoutCategories=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const categories=Object.freeze([
    {id:"push",label:"Push",aliases:[]},{id:"pull",label:"Pull",aliases:[]},{id:"fullbody",label:"Fullbody",aliases:["full body","helkropp","fullkropp"]},{id:"crosstrening",label:"Cross",aliases:["cross","cross training","crosstraining"]},{id:"kroppsvekt",label:"Kroppsvekt",aliases:["bodyweight","kroppsvektøkt"]},{id:"tabata",label:"Tabata",aliases:[]},{id:"core",label:"Core",aliases:["kjerne"]},{id:"morgen",label:"Morgentrening",aliases:["morgenøkt","morgentrening"]},{id:"toying",label:"Tøying",aliases:["tøying","toying","yoga","mobilitet"]},{id:"nodokt",label:"Nødøkt",aliases:["nødøkt","nodokt"]}
  ]);
  const aliasMap=new Map();
  categories.forEach(category=>[category.id,category.label,...category.aliases].forEach(value=>aliasMap.set(String(value).trim().toLocaleLowerCase("nb-NO"),category.id)));
  const normalizeCategory=value=>aliasMap.get(String(value??"").trim().toLocaleLowerCase("nb-NO"))||null;
  const labelFor=value=>categories.find(category=>category.id===normalizeCategory(value))?.label||"Egen";
  const categoryOf=(workout,originals=[])=>{if(!workout||typeof workout!=="object")return null;const sourceId=workout.sourceTemplateId||workout.workoutId||workout.templateId;const original=sourceId&&originals.find(item=>item.id===sourceId);const originalCategory=normalizeCategory(original?.cat??original?.category??original?.workoutType);if(originalCategory)return originalCategory;for(const value of [workout.cat,workout.category,workout.workoutType,workout.type]){const normalized=normalizeCategory(value);if(normalized)return normalized;}return null;};
  const withCategory=(workout,originals=[],fallback=null)=>({...workout,cat:categoryOf(workout,originals)||normalizeCategory(fallback)||null});
  return {categories,normalizeCategory,labelFor,categoryOf,withCategory};
});
