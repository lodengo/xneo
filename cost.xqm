module namespace cost = 'cost';

declare updating function cost:createFile($data){
  let $fileid:= random:uuid()
  let $costId := random:uuid()
  let $type := $data/type/text()
  let $n := copy $n := doc('fees')//node()[name()=$type]
  modify(
    for $fee in $n//fee return    
    insert node <fee><file>{$fileid}</file><costId>{$costId}</costId><costType>{$type}</costType><id>{random:uuid()}</id></fee>/node() into $fee
  )
  return $n
  let $cost :=
  <cost>
  <id>{$costId}</id>
  {$data/node()}
  <fees>{$n/node()}</fees>
  </cost>  
 
  return(     
    db:create($fileid, $cost, $fileid),       
    db:output(<result><file>{$fileid}</file><id>{$costId}</id></result>)
  )  
};

declare updating function cost:insertCost($data, $file as xs:string*, $parentid as xs:string*){
  let $costId := random:uuid()
  let $type := $data/type/text()
  let $n := copy $n := doc('fees')//node()[name()=$type]
  modify(
      for $fee in $n//fee return    
      insert node <fee><file>{$file}</file><costId>{$costId}</costId><costType>{$type}</costType><id>{random:uuid()}</id></fee>/node() into $fee
  )
  return $n
  let $cost :=
  <cost>
  <id>{$costId}</id>
  {$data/node()}
  <fees>{$n/node()}</fees>
  </cost>
  
  let $parent := doc($file)//cost[id=$parentid] return(
      insert node $cost into $parent,     
      db:output(<result><id>{$costId}</id></result>) 
  )   
};

declare function cost:feesToFlushOnCostCreate($file, $costId){
  let $cost := doc($file)//cost[id=$costId]
  let $cost_fees := $cost//fee 
  let $cost_parent_fees_cc := $cost/../fees//fee[matches(feeExpr, "cc")]
  let $cost_sibling := $cost/../cost[id != $costId]
  let $cost_sibling_fees_cs := $cost_sibling/fees//fee[matches(feeExpr, "cs")]
  return <fees>{($cost_fees,$cost_parent_fees_cc,$cost_sibling_fees_cs)}</fees>
};

declare updating function cost:createRefsTo($file, $fromFeeId, $toIds){
  let $fee := doc($file)//fee[id=$fromFeeId]
  return for $toId in $toIds/id/text() return(
    let $toNode := doc($file)//id[text()=$toId]/.. 
    return (
      if($fee/refTo[text()=$toId])
      then ()
      else insert node <refTo>{$toId}</refTo>into $fee
      ,
      if($toNode/refFrom[text()=$fromFeeId]) then () 
      else insert node <refFrom>{$fromFeeId}</refFrom> into $toNode
    )   
  )  
};

declare updating function cost:removeRefsTo($file, $fromFeeId, $toIds){
  let $fee := doc($file)//fee[id=$fromFeeId]
  return for $toId in $toIds/id/text() return(
    let $toNode := doc($file)//id[text()=$toId]/.. 
    return (
      delete node $fee/refTo[text()=$toId],    
      delete node $toNode/refFrom[text()=$fromFeeId]
    )   
  )  
};

declare function cost:getRefedToIdsOfFee($file, $fromFeeId){
   <ids>{doc($file)//fee[id=$fromFeeId]/refTo}</ids>
};

declare function cost:getRefToIdsOf($file, $ids){
  <result>{
  for $id in $ids/id/text() return (
    let $node := doc($file)//id[text()=$id]/..
    let $refTo := $node/refTo
    let $refFrom := $node/refFrom
    return <fromto><from>{$refFrom}</from><id>{$id}</id><to>{$refTo}</to></fromto>
  )
  }</result>
};

declare updating function cost:setFeeResult($file, $feeId, $result){
  replace value of node doc($file)//fee[id=$feeId]/feeResult with $result
};

declare function cost:getFee($file, $id){
  doc($file)//fee[id=$id]
};

declare function cost:_C($file, $costId, $prop){
  let $cost := doc($file)//cost[id=$costId and $prop]
  return <result><id>{$costId}</id><value>{$cost/node()[name=$prop]/text()}</value></result>
};

declare function cost:_CF($file, $costId, $feeName){
  let $fee := doc($file)//cost[id=$costId]/fees//fee[feeName=$feeName]
  return <result><id>{$fee/id/text()}</id><value>{$fee/feeResult/text()}</value></result>
};

declare function cost:_CC($file, $costId, $type, $prop){
  let $cost := doc($file)//cost[id=$costId]/cost[type=$type and $prop]
  return <result><id>{$cost/id/text()}</id><value>{$cost/node()[name=$prop]/text()}</value></result>
};

declare function cost:_CCF($file, $costId, $type, $feeName){
  let $fee := doc($file)//cost[id=$costId]/cost[type=$type]/fees//fee[feeName=$feeName]
  return <result><id>{$fee/id/text()}</id><value>{$fee/feeResult/text()}</value></result>
};

declare function cost:_CS($file, $costId, $prop){
  let $cost := doc($file)//cost[id=$costId]/../cost[id != $costId and $prop]
  return <result><id>{$cost/id/text()}</id><value>{$cost/node()[name=$prop]/text()}</value></result>
};

declare function cost:_CSF($file, $costId, $feeName){
  let $fee := doc($file)//cost[id=$costId]/../cost/fees//fee[feeName=$feeName]
  return <result><id>{$fee/id/text()}</id><value>{$fee/feeResult/text()}</value></result>
};

declare function cost:_CAS($file, $costId, $prop){
  let $cost := doc($file)//cost[id=$costId]/ancestor-or-self[$prop]
  return <result><id>{$cost/id/text()}</id><value>{$cost/node()[name=$prop]/text()}</value></result>
};

