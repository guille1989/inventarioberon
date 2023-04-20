import React, { Component } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel, Highlight } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMP: []
        }
    }
    
    componentDidMount(){
        //Traemos la info de la db - GET
        const fetchOptcions = {
            method: 'GET',
            headers : {'Content-type':'application/json'},   
        }

        fetch(`http://${process.env.REACT_APP_URL_PRODUCCION}/api/mpgraficas`, fetchOptcions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    dataMP: data.mps
                })
            })
            .catch(err => {
                console.log('error ' + err)
            })
    }

    render() {
        return (
            
                <div className='control-pane'>               
                <div className='control-section'>
                    <ChartComponent 
                        id='charts' 
                        style={{ textAlign: "center" }} 
                        legendSettings={{ enableHighlight: true }} 
                        primaryXAxis={{ valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 } }} 
                        primaryYAxis={{ title: 'Peso en (Kg)', majorTickLines: { width: 0 }, lineStyle: { width: 0 }, maximum: 10000, interval: 1000, }} 
                        chartArea={{ border: { width: 0 } }} 
                        load={this.load.bind(this)} 
                        tooltip={{ enable: true, header: "<b>Peso Disponible M.P.</b>", shared: false }} 
                        width={Browser.isDevice ? '100%' : '75%'} 
                        title='Inventario de Materia Prima Disponible' 
                        loaded={this.onChartLoad.bind(this)}>

                        <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel, Highlight]}/>
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={this.state.dataMP} tooltipMappingName='_id' xName='_id' columnSpacing={0.1} yName='totalMateriaPrima' name='Tipo de  Materia Prima' type='Column'>
                            </SeriesDirective>

                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </div>
         
        );
    }

    onChartLoad(args) {
        let chart = document.getElementById('charts');
        chart.setAttribute('title', '');
    };
    load(args) {
        
    };
}

export default Dashboard;