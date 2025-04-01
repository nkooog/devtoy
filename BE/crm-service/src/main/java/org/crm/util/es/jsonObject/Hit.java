package org.crm.util.es.jsonObject;

import lombok.*;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hit {
	private Total total;
	private double max_score;
	private ArrayList<Hit> hits;
	private String _index;
	private String _type;
	private String _id;
	private double _score;
	private Source _source;
	private Highlight highlight;
}
