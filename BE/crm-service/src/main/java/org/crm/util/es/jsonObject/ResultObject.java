package org.crm.util.es.jsonObject;


import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ResultObject {
	private int took;
	private boolean timed_out;
	private Shards _shards;
	private Hit hits;
}























