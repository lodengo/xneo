module namespace cost = 'cost';

declare updating function cost:createFile($data){
  let $id := random:uuid()
  let $type := $data/type/text()
  let $n := copy $n := doc('fees')//node()[name()=$type]
  modify(
    for $fee in $n//fee return    
    insert node <id>{random:uuid()}</id> into $fee
  )
  return $n
  let $cost :=
  <cost>
  <id>{$id}</id>
  {$data/node()}
  {$n/node()}
  </cost>  
 
  let $fileid:= random:uuid() return(     
    db:create($fileid, $cost, $fileid),       
    db:output(<result><file>{$fileid}</file><id>{$id}</id></result>)
  )  
};

declare updating function cost:insertCost($data, $file as xs:string*, $parentid as xs:string*){
  let $id := random:uuid()
  let $type := $data/type/text()
  let $n := copy $n := doc('fees')//node()[name()=$type]
  modify(
      for $fee in $n//fee return    
      insert node <id>{random:uuid()}</id> into $fee
  )
  return $n
  let $cost :=
  <cost>
  <id>{$id}</id>
  {$data/node()}
  {$n/node()}
  </cost>
  
  let $parent := doc($file)//cost[id=$parentid] return(
      insert node $cost into $parent,     
      db:output(<result><id>{$id}</id></result>) 
  )   
};

declare function cost:feesToFlushOnCostCreate($file, $id){
  let $cost := doc($file)//cost[id=$id]
  let $cost_fees := $cost//fee/id
  let $cost_parent := $cost/../cost
  let $cost_parent_fees_cc := $cost_parent//fee[feeExpr]/id
  return $cost_fees
};