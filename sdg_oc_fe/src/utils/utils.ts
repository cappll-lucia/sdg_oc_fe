export const isCuit =(_cuit: string)=>{
    if (typeof _cuit !== 'string') return false;
          return /^\d{2}-\d{8}-\d{1}$/.test(_cuit);
}