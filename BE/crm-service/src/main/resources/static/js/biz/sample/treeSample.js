/***********************************************************************************************
 * Program Name : Kendo Tree example(treeSample.js)
 * Creator      : bykim
 * Create Date  : 2022.01.25
 * Description  : Kendo Tree example
 * Modify Desc  : 
 * -----------------------------------------------------------------------------------------------
 * Date         | Updater        | Remark
 * -----------------------------------------------------------------------------------------------
 * 2022.01.25     bykim            최초작성   
 ************************************************************************************************/
var sampleDataSource, sampleDataSource2, sampleDataSource3 ;

var select_data, treeData ;

$(document).ready(function () {

	sampleDataSource1 = {
//			transport: {
//			read: {
//			url: service + "/EmployeeDirectory/All",
//			dataType: "jsonp"
//			}
//			},
			schema: {
				model: {
//					parentId: "Position", // data안에 parentId가 지정되어 있을경우 설정 안해줘도 됨
					fields: {
						ReportsTo: { field: "Position",  nullable: true },
						Name: { field: "Name" },
						Phone: { field: "Phone" , editable:false }
					},
					expanded: true
				}
			}
	};

	var treeGridDataSource = new kendo.data.TreeListDataSource(sampleDataSource1);

	$("#treeGrid").kendoTreeList({
		dataSource: treeGridDataSource,
		autoBind: false,
		height: 540,
		editable: "incell",
		columns: [
			 { selectable: true, width: "50px" },
			  { command: [{
				 // name: "createchild", text:" ",
				  name:"+",
			        template : "<div class='grid_td'><button type='button' class='btn_grid_gray' onclick='SYSM130_fnPopup_SYSM210P()'><span>+</span></button>",
//			        click: function(e) {
//			         alert("들어옴")
//			        }
			  }], width: "50px" 
			  }
			  ,
//			 {template : "<div class='grid_td'><button type='button' class='btn_grid_gray' onclick='SYSM130_fnPopup_SYSM210P()'><span>+</span></button>",
//},
			{ field: "Position"},
			{ field: "Name" },
			{ field: "Phone"}
			],
			
			selectable: "row",
			editable	: {
				confirmation: false, // Remove Row 확인창 삭제
				mode :"incell",
			},
			change: function(e) {
				let selectedRows = this.select();
				let selectedDataItems = [];
				for (let i = 0; i < selectedRows.length; i++) {
					let dataItem = this.dataItem(selectedRows[i]);
					selectedDataItems.push(dataItem);
					select_data = dataItem;
				}
				

			},
	});

	

	var tmp = '<!DOCTYPE html><html> <head> <title>제목없음</title> <meta http-equiv="Content-type" content="text/html; charset=utf-8" />'+
	'<style type="text/css" id="NamoSE__GeneralStyle"> body{font-family :돋움; color : #000000; font-size : 12pt; word-Wrap : break-word; margin: 7px 7px 0 7px;} p,li{line-height:1.2;  word-wrap: break-word; margin-top:0; margin-bottom:0;} body{overflow:auto;}.NamoSE_layoutlock_show { word-break: break-all;}'+
	'</style>'+
	'</head> <body>'+
	'<p><span style="background-color: rgb(255, 0, 0);">테에에에에에에에스트<span style="background-color: rgb(0, 255, 255);">&nbsp; &nbsp; &nbsp;testtesttest</span></span></p>'+
	'<p><span style="font-family: 궁서;">테스트 테스트 테스트</span></p>'+
	'</body></html>';

	
 treeData =   [
		
		//{ id: 1, Name: "Daryl Sweeney", Position: "CEO", Phone: "(555) 924-9726", parentId: null },
		{ id: 1, Name: "Daryl Sweeney", Position: "CEO", Phone: tmp, parentId: null },
		{ id: 2, Name: "Guy Wooten", Position: "Chief Technical Officer", Phone: "(438) 738-4935", parentId: 1 },
		{ id: 32, Name: "Buffy Weber", Position: "VP, Engineering", Phone: "(699) 838-6121", parentId: 2 },
		{ id: 11, Name: "Hyacinth Hood", Position: "Team Lead", Phone: "(889) 345-2438", parentId: 32 },
		{ id: 60, Name: "Akeem Carr", Position: "Junior Software Developer", Phone: "(738) 136-2814", parentId: 11 },
		{ id: 78, Name: "Rinah Simon", Position: "Software Developer", Phone: "(285) 912-5271", parentId: 11 },
		{ id: 42, Name: "Gage Daniels", Position: "Software Architect", Phone: "(107) 290-6260", parentId: 32 },
		{ id: 43, Name: "Constance Vazquez", Position: "Director, Engineering", Phone: "(800) 301-1978", parentId: 32 },
		{ id: 46, Name: "Darrel Solis", Position: "Team Lead", Phone: "(327) 977-0216", parentId: 43 },
		{ id: 47, Name: "Brian Yang", Position: "Senior Software Developer", Phone: "(565) 146-5435", parentId: 46 },
		{ id: 50, Name: "Lillian Bradshaw", Position: "Software Developer", Phone: "(323) 509-3479", parentId: 46 },
		{ id: 51, Name: "Christian Palmer", Position: "Technical Lead", Phone: "(490) 421-8718", parentId: 46 },
		{ id: 55, Name: "Summer Mosley", Position: "QA Engineer", Phone: "(784) 962-2301", parentId: 46 },
		{ id: 56, Name: "Barry Ayers", Position: "Software Developer", Phone: "(452) 373-9227", parentId: 46 },
		{ id: 59, Name: "Keiko Espinoza", Position: "Junior QA Engineer", Phone: "(226) 600-5305", parentId: 46 },
		{ id: 61, Name: "Candace Pickett", Position: "Support Officer", Phone: "(120) 117-7475", parentId: 46 },
		{ id: 63, Name: "Mia Caldwell", Position: "Team Lead", Phone: "(848) 636-6470", parentId: 43 },
		{ id: 65, Name: "Thomas Terry", Position: "Senior Enterprise Support Officer", Phone: "(764) 831-4248", parentId: 63 },
		{ id: 67, Name: "Ruth Downs", Position: "Senior Software Developer", Phone: "(138) 991-1440", parentId: 63 },
		{ id: 70, Name: "Yasir Wilder", Position: "Senior QA Enginner", Phone: "(759) 701-8665", parentId: 63 },
		{ id: 71, Name: "Flavia Short", Position: "Support Officer", Phone: "(370) 133-9238", parentId: 63 },
		{ id: 74, Name: "Aaron Roach", Position: "Junior Software Developer", Phone: "(958) 717-9230", parentId: 63 },
		{ id: 75, Name: "Eric Russell", Position: "Software Developer", Phone: "(516) 575-8505", parentId: 63 },
		{ id: 76, Name: "Cheyenne Olson", Position: "Software Developer", Phone: "(241) 645-0257", parentId: 63 },
		{ id: 77, Name: "Shaine Avila", Position: "UI Designer", Phone: "(844) 435-1360", parentId: 63 },
		{ id: 81, Name: "Chantale Long", Position: "Senior QA Enginner", Phone: "(252) 419-6891", parentId: 63 },
		{ id: 83, Name: "Dane Cruz", Position: "Junior Software Developer", Phone: "(946) 701-6165", parentId: 63 },
		{ id: 84, Name: "Regan Patterson", Position: "Technical Writer", Phone: "(265) 946-1765", parentId: 63 },
		{ id: 85, Name: "Drew Mckay", Position: "Senior Software Developer", Phone: "(327) 293-0162", parentId: 63 },
		{ id: 88, Name: "Bevis Miller", Position: "Senior Software Developer", Phone: "(525) 557-0169", parentId: 63 },
		{ id: 89, Name: "Bruce Mccarty", Position: "Support Officer", Phone: "(936) 777-8730", parentId: 63 },
		{ id: 90, Name: "Ocean Blair", Position: "Team Lead", Phone: "(343) 586-6614", parentId: 43 },
		{ id: 91, Name: "Guinevere Osborn", Position: "Software Developer", Phone: "(424) 741-0006", parentId: 90 },
		{ id: 92, Name: "Olga Strong", Position: "Graphic Designer", Phone: "(949) 417-1168", parentId: 90 },
		{ id: 93, Name: "Robert Orr", Position: "Support Officer", Phone: "(977) 341-3721", parentId: 90 },
		{ id: 95, Name: "Odette Sears", Position: "Senior Software Developer", Phone: "(264) 818-6576", parentId: 90 },
		{ id: 45, Name: "Zelda Medina", Position: "QA Architect", Phone: "(563) 359-6023", parentId: 32 },
		{ id: 3, Name: "Priscilla Frank", Position: "Chief Product Officer", Phone: "(217) 280-5300", parentId: 1 },
		{ id: 4, Name: "Ursula Holmes", Position: "EVP, Product Strategy", Phone: "(370) 983-8796", parentId: 3 },
		{ id: 24, Name: "Melvin Carrillo", Position: "Director, Developer Relations", Phone: "(344) 496-9555", parentId: 3 },
		{ id: 29, Name: "Martha Chavez", Position: "Developer Advocate", Phone: "(140) 772-7509", parentId: 24 },
		{ id: 30, Name: "Oren Fox", Position: "Developer Advocate", Phone: "(714) 284-2408", parentId: 24 },
		{ id: 41, Name: "Amos Barr", Position: "Developer Advocate", Phone: "(996) 587-8405", parentId: 24 },
		{ id: 99, Name: "testeset", Position: "testeset", Phone: "testeset", parentId: 2 }
		
		];

	
	console.log(treeData)
	
	$("#treeGrid").data("kendoTreeList").dataSource.data(treeData);






	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

	
	
	sampleDataSource2 = {
			schema: {
				model: {
					 id: "categoryName",
					 hasChildren: "HasEmployees",
					 children: "subCategories"
				}
			},
			data:[]
	};

	var inline1 = new kendo.data.HierarchicalDataSource(sampleDataSource2);

	$("#treeView").kendoTreeView({
		dataSource: inline1,
		dataTextField: [ "categoryName" ]
	});

	var treeData2 =   [
		{ categoryName: "Storage", HasEmployees : true, subCategories: [
			{ categoryName: "Wall Shelving"},
			{ categoryName: "Floor Shelving"  },
			{ categoryName: "Kids Storage", HasEmployees : true, subCategories: [
				{ categoryName: "testest"},
				]}
			] },
			{ categoryName: "Lights", HasEmployees : true, subCategories: [
				{ categoryName: "Ceiling"},
				{ categoryName: "Table" },
				{ categoryName: "Floor"}
				] }
			];

	$("#treeView").data("kendoTreeView").dataSource.data(treeData2);
	


	//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


	sampleDataSource3 = {
			data:[]
	};

	var inline2 = new kendo.data.HierarchicalDataSource(sampleDataSource3);

	$("#treeDialog").kendoTreeView({
		loadOnDemand: false,
		checkboxes: {
			checkChildren: true
		},
		dataSource: inline2,
		check: onCheck,
		expand: onExpand
	});
	
	var treeData3 =   [{
	    id: 1, text: "Furniture", expanded: true, items: [
	        { id: 2, text: "tables & chairs" },
	        { id: 3, text: "sofas" },
	        { id: 4, text: "occasional furniture" },
	        { id: 5, text: "childrens furniture" },
	        { id: 6, text: "beds" }
	    ]
	},
	    {
	        id: 7, text: "Decor", expanded: true, items: [
	           { id: 8, text: "bed linen" },
	           { id: 9, text: "throws" },
	           { id: 10, text: "curtains & blinds" },
	           { id: 11, text: "rugs" },
	           { id: 12, text: "carpets" }
	        ]
	    },
	    {
	        id: 13, text: "Storage", expanded: true, items: [
	           { id: 14, text: "wall shelving" },
	           { id: 15, text: "kids storage" },
	           { id: 16, text: "multimedia storage" },
	           { id: 17, text: "floor shelving" },
	           { id: 18, text: "toilet roll holders" },
	           { id: 19, text: "storage jars" },
	           { id: 20, text: "drawers" },
	           { id: 21, text: "boxes" }
	        ]
	    }
	];
	
	$("#treeDialog").data("kendoTreeView").dataSource.data(treeData3);


	var dialog = $("#dialog");
	
	var multiSelect = $("#multiselect").data("kendoMultiSelect");
	$("#openWindow").kendoButton({
		themeColor: "primary"
	});

	multiSelect.readonly(false);

	$("#openWindow").click(function () {
		dialog.data("kendoDialog").open();
		$(this).fadeOut();
	});

	dialog.kendoDialog({
		width: "400px",
		title: "Categories",
		visible: false,
		actions: [
			{
				text: 'Cancel',
				primary: false,
				action: onCancelClick
			},
			{
				text: 'Ok',
				primary: true,
				action: onOkClick
			}
			],
			close: onClose
	}).data("kendoDialog").open();

});


$("#multiselect").kendoMultiSelect({
	dataTextField: "text",
	dataValueField: "id"
});


function onCancelClick(e) {
    e.sender.close();
}

function onClose() {
    $("#openWindow").fadeIn();
}


function onOkClick(e) {
    var checkedNodes = [];
    var treeView = $("#treeDialog").data("kendoTreeView");

    getCheckedNodes(treeView.dataSource.view(), checkedNodes);
    populateMultiSelect(checkedNodes);

    e.sender.close();
}

function getCheckedNodes(nodes, checkedNodes) {
    var node;

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];

        if (node.checked) {
            checkedNodes.push({ text: node.text, id: node.id });
        }

        if (node.hasChildren) {
            getCheckedNodes(node.children.view(), checkedNodes);
        }
    }
}

function onCheck() {
    var checkedNodes = [];
    var treeView = $("#treeDialog").data("kendoTreeView");

    getCheckedNodes(treeView.dataSource.view(), checkedNodes);
}


function chbAllOnChange() {
    var checkedNodes = [];
    var treeView = $("#treeDialog").data("kendoTreeView");
    var isAllChecked = $('#chbAll').prop("checked");

    checkUncheckAllNodes(treeView.dataSource.view(), isAllChecked)

}

function onExpand(e) {
    if ($("#filterText").val() == "") {
        $(e.node).find("li").show();
    }
}

function checkUncheckAllNodes(nodes, checked) {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].set("checked", checked);

        if (nodes[i].hasChildren) {
            checkUncheckAllNodes(nodes[i].children.view(), checked);
        }
    }
}

function populateMultiSelect(checkedNodes) {
    var multiSelect = $("#multiselect").data("kendoMultiSelect");
    multiSelect.dataSource.data([]);

    var multiData = multiSelect.dataSource.data();
    if (checkedNodes.length > 0) {
        var array = multiSelect.value().slice();
        for (var i = 0; i < checkedNodes.length; i++) {
            multiData.push({ text: checkedNodes[i].text, id: checkedNodes[i].id });
            array.push(checkedNodes[i].id.toString());
        }

        multiSelect.dataSource.data(multiData);
        multiSelect.dataSource.filter({});
        multiSelect.value(array);
    }
}


$("#filterText").keyup(function (e) {
    var filterText = $(this).val();

    if (filterText !== "") {
        $(".selectAll").css("visibility", "hidden");

        $("#treeDialog .k-group .k-group .k-in").closest("li").hide();
        $("#treeDialog").closest("li").hide();
        $("#treeDialog .k-in:contains(" + filterText + ")").each(function () {
            $(this).parents("ul, li").each(function () {
                var treeView = $("#treeDialog").data("kendoTreeView");
                treeView.expand($(this).parents("li"));
                $(this).show();
            });
        });
        $("#treeDialog .k-group .k-in:contains(" + filterText + ")").each(function () {
            $(this).parents("ul, li").each(function () {
                $(this).show();
            });
        });
    }
    else {
        $("#treeDialog .k-group").find("li").show();
        var nodes = $("#treeDialog > .k-group > li");

        $.each(nodes, function (i, val) {
            if (nodes[i].getAttribute("data-expanded") == null) {
                $(nodes[i]).find("li").hide();
            }
        });

        $(".selectAll").css("visibility", "visible");
    }
});


function SYSM130_fnPopup_SYSM210P(){
	alert("들어옴")
}


//SYSM130_fnRowInsertData(idx+1,SYSM130M_Select_data.prsLvlCd,Number(decode.orgCd)+1,null,SYSM130M_Select_data.hgrkOrgCd,SYSM130M_Select_data.hgrkOrgNm,"");
//Grid Row 추가
function append() {
	console.log("드러옴")
	$("#treeGrid").data("kendoTreeList").dataSource.add(
			{id : treeData.length,  Name: "testeset22222", Position: "testeset22222", Phone: "testeset22222", parentId: 2
	});
}


