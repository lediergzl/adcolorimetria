/* ColorPro — product catalog engine v1.3 */
function clean(v){return String(v??'').trim();}
function normalize(product={}){return {id:clean(product.id),brandId:clean(product.brandId),brand:clean(product.brand),line:clean(product.line),shade:clean(product.shade),category:clean(product.category||'color'),developerRatio:product.developerRatio??null,source:clean(product.source||'unknown'),verified:product.verified===true};}
function isUsable(product={}){const p=normalize(product);return !!p.id&&!!p.shade&&p.verified===true;}
function filter(products=[],query=''){const q=clean(query).toLowerCase();return products.map(normalize).filter(p=>!q||[p.brand,p.line,p.shade,p.category].join(' ').toLowerCase().includes(q));}
function developerStatus(product={}){const p=normalize(product);if(!p.verified)return 'no-verificado';if(p.developerRatio==null)return 'requiere-ficha-fabricante';return 'verificado';}
function validateForFormula(product={}){const p=normalize(product),warnings=[];if(!p.verified)warnings.push('Producto no verificado: no se permite asumir datos técnicos.');if(p.category==='color'&&!p.shade)warnings.push('Falta el tono/código comercial.');if(p.developerRatio==null)warnings.push('Proporción de oxidante no disponible: consultar ficha del fabricante.');return {valid:warnings.length===0,warnings,product:p,developerStatus:developerStatus(p)};}
export const ProductEngine={normalize,isUsable,filter,developerStatus,validateForFormula};
if(typeof window!=='undefined')window.ProductEngine=ProductEngine;
