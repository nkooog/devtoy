function KMST_constAuthParam(){
	return {
		tenantId: GLOBAL.session.user.tenantId,
		orgCd: GLOBAL.session.user.orgCd,
		usrGrdCd: GLOBAL.session.user.usrGrd,
		usrId: GLOBAL.session.user.usrId
	};
}

function KMST_fnTreeSet(list,type) {
	let MappedArr = [];

	if(type == null){
		for (let item of list) {
			let data = {
				id: item.ctgrNo,        // 자신 코드
				hgrkCtgrNo: item.hgrkCtgrNo,    // 부모 코드
				ctgrNm: item.ctgrNm,        // 자신 이름
				brdpath: item.brdpath,
				ctgrAttrCd: item.ctgrAttrCd,
			};
			MappedArr.push(data);
		}
	}else{
		for (let item of list) {
			let data = {
				id: item.ctgrNo,        // 자신 코드
				hgrkCtgrNo: item.hgrkCtgrNo,    // 부모 코드
				ctgrNm: item.ctgrNm,        // 자신 이름
				brdpath: item.brdpath,
				ctgrAttrCd: item.ctgrAttrCd,
				cntntsRegApvNcsyYn: item.cntntsRegApvNcsyYn,
			};
			MappedArr.push(data);
		}
	}
	return Utils.CreateTreeDataFormat(MappedArr, "hgrkCtgrNo",true);
}



function KMST_fnTreeSetCount(list) {
	let MappedArr = [];
	for (let item of list) {
		let data = {
			id			: item.ctgrNo,        // 자신 코드
			hgrkCtgrNo	: item.hgrkCtgrNo ,    // 부모 코드
			ctgrNm		: item.ctgrNm,        // 자신 이름
			case 		: item.count,
			path 		: item.brdpath,
		};
		MappedArr.push(data);
	}
	return Utils.CreateTreeDataFormat(MappedArr,"hgrkCtgrNo",true);
}

function KMST_fnTreeCheckListValid (brdlist) {
	let checkId = [];

	if(Utils.isNull(brdlist)){
		return checkId;
	}
	brdlist.forEach(function (val) {
		if (val.prsLvl === 1) {
			checkId.push(val);
		} else {
			let isParentExist = false;
			brdlist.forEach(function (parentval) {
				if (val.hgrkCtgrNo === parentval.ctgrNo) {
					isParentExist = true;
					return false;
				}
			});

			if (isParentExist) {
				checkId.push(val);
			}
		}
	});

	if (JSON.stringify(brdlist) === JSON.stringify(checkId)) {
		return checkId;
	} else {
		return KMST_fnTreeCheckListValid(checkId);
	}
}

function KMST_fnCheckedNodeIds(nodes, checkedNodes) {
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].checked) {
			checkedNodes.push(nodes[i]);
		}
		if (nodes[i].hasChildren) {
			KMST_fnCheckedNodeIds(nodes[i].children.view(), checkedNodes);
		}
	}
}


function KMST_fnTreeChangeList(tree,list)  {
	for (let i = 0; i < tree.length; i++) {
		list.push(tree[i]);
		if (tree[i].items.length > 0) {
			KMST_fnTreeChangeList(tree[i].items,list);
		}
	}
}

function KMST_CreateKMSIndexList(cntns){
	let index = "";

	for(let i=0;i<cntns.length;i++){
		let title = ""

		if($(Utils.htmlDecode(cntns[i].moktiTite)).length>0){
			title = $(Utils.htmlDecode(cntns[i].moktiTite))[0].textContent;
		}else{
			title = Utils.htmlDecode(cntns[0].moktiTite)
		}

		let href  = ' href="#Temp_'+cntns[i].moktiNo+'"';

		if(i === 0){
			index += '<li><a'+href+'>'+title +'</a>';
		}else{
			let obj = {
				1:{
					1:'</li><li><a'+href+'>'+ title +'</a>',
					2:'<ol><li><a'+href+'>'+ title +'</a>'
				},
				2:{
					1: '</ol></li><li><a'+href+'>'+ title +'</a>',
					2: '</li><li><a'+href+'>'+ title +'</a>',
					3: '<ol><li><a'+href+'>'+ title +'</a></li>',
				},
				3:{
					1:'</ol></li><li><a'+href+'>'+ title +'</a>',
					2:'</ol></li><li><a'+href+'>'+ title +'</a>',
					3:'<li><a'+href+'>'+ title +'</a></li>'
				}
			}
			index += obj[cntns[i-1].moktiPrsLvl][cntns[i].moktiPrsLvl]
		}
	}
	return index;
}