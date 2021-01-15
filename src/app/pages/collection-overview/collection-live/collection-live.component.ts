import { Component, OnInit } from '@angular/core';
import { customizeUtil, MindMapMain } from 'mind-map';

const HIERARCHY_RULES = {
  ROOT: {
    name: 'XX汽车有限公司',
    backgroundColor: '#7EC6E1',
    getChildren: () => [
      HIERARCHY_RULES.SALES_MANAGER,
      HIERARCHY_RULES.SHOW_ROOM,
      HIERARCHY_RULES.SALES_TEAM
    ]
  },
  SALES_MANAGER: {
    name: '销售经理',
    color: '#fff',
    backgroundColor: '#616161',
    getChildren: () => [
      HIERARCHY_RULES.SHOW_ROOM,
      HIERARCHY_RULES.SALES_TEAM
    ]
  },
  SHOW_ROOM: {
    name: '展厅',
    color: '#fff',
    backgroundColor: '#989898',
    getChildren: () => [
      HIERARCHY_RULES.SALES_TEAM
    ]
  },
  SALES_TEAM: {
    name: '销售小组',
    color: '#fff',
    backgroundColor: '#C6C6C6',
    getChildren: () => []
  }
};

const option = {
  container: 'jsmind_container',
  theme: 'normal',
  editable: true,
  selectable: false,
  depth: 4,
  hierarchyRule: HIERARCHY_RULES,
  enableDraggable: true,
};

const mind = {
  'format': 'nodeTree',
  'data': {
    'id': 43,
    'topic': 'Reisvoucher',
    'selectedType': false,
    'backgroundColor': '#7EC6E1',
    'children': [
      {
        'id': 80,
        'color': '#fff',
        'topic': 'show room',
        'direction': 'right',
        'selectedType': '销售经理',
        'backgroundColor': '#616161',
        'children': []
      },
      {
        'id': 44,
        'color': '#fff',
        'topic': 'Iets',
        'direction': 'right',
        'selectedType': '销售经理',
        'backgroundColor': '#616161',
        'children': [
          {
            'id': 46,
            'color': '#fff',
            'topic': 'Iets anders',
            'direction': 'right',
            'selectedType': '展厅',
            'backgroundColor': '#989898',
            'children': [
              {
                'id': 49,
                'color': '#fff',
                'topic': 'Nog iets',
                'direction': 'right',
                'selectedType': '销售小组',
                'backgroundColor': '#C6C6C6',
                'children': []
              },
              {
                'id': 51,
                'color': '#fff',
                'topic': 'Weer iets',
                'direction': 'right',
                'selectedType': '销售小组',
                'backgroundColor': '#C6C6C6',
                'children': []
              },
              {
                'id': 47,
                'color': '#fff',
                'topic': 'Een topic',
                'direction': 'right',
                'selectedType': '销售小组',
                'backgroundColor': '#C6C6C6',
                'children': []
              },
              {
                'id': 48,
                'color': '#fff',
                'topic': 'Nog een topic',
                'direction': 'right',
                'selectedType': '销售小组',
                'backgroundColor': '#C6C6C6',
                'children': []
              },
              {
                'id': 50,
                'color': '#fff',
                'topic': 'Oeh!',
                'direction': 'right',
                'selectedType': '销售小组',
                'backgroundColor': '#C6C6C6',
                'children': []
              }
            ]
          }
        ]
      },
      {
        'id': 45,
        'color': '#fff',
        'topic': 'Hey, jij hier?',
        'direction': 'right',
        'selectedType': '销售经理',
        'backgroundColor': '#616161',
        'children': []
      }
    ]
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './collection-live.component.html',
  styleUrls: ['./collection-live.component.scss']
})
export class CollectionLiveComponent implements OnInit {
  mindMap;

  ngOnInit(): void {
    this.mindMap = MindMapMain.show(option, mind);
  }

  removeNode(): void {
    const selectedNode = this.mindMap.getSelectedNode();
    const selectedId = selectedNode && selectedNode.id;

    if (!selectedId) {
      return;
    }
    this.mindMap.removeNode(selectedId);
  }

  addNode(): void {
    const selectedNode = this.mindMap.getSelectedNode();
    if (!selectedNode) {
      return;
    }

    const nodeId = customizeUtil.uuid.newid();
    this.mindMap.addNode(selectedNode, nodeId);
  }

  getMindMapData(): string {
    const data = this.mindMap.getData().data;
    console.log('data: ', data);
    return data;
  }
}
