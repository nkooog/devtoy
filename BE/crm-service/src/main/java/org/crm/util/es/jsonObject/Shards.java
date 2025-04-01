package org.crm.util.es.jsonObject;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Shards {
	private int total;
	private int successful;
	private int skipped;
	private int failed;
}
