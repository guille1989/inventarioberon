import React, { Component } from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Filter,
    Sort,
    Edit,
    Toolbar,
    Page,
    Selection,
    ExcelExport,
    DetailRow,
    Aggregate, Group, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, resetInfiniteBlocks,
  } from '@syncfusion/ej2-react-grids';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-react-popups';
import { Browser } from '@syncfusion/ej2-base';
import { NumericTextBoxComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import '../../App.css';

let dialogObj;

class SeguimientoRecetas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_mp: [],
            data_recetas: [],
            hideDialogNreceta:false,
            numInputsMP: [1],
            contAuxAux: 2,

            responsableReceta: '',
            compuestoReceta: '',
            nombreReceta: '',
            tamanioBolsaReceta: '',
        }
    }

    componentDidMount(){
        //Traemos la MP
        const fetchOptions = {
            method: 'GET',
            headers : {'Content-type':'application/json'},    
        }

        fetch('http://localhost:3001/api/leermp', fetchOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.mps.resultRecetas)

                this.setState({
                    data_mp: data.mps.result,
                    data_recetas: data.mps.resultRecetas
                })
            })
            .catch(error => {
                console.log('falla en recepcion de data... ' + error)
            })

        //BTN
        if(Browser.isDevice){
            this.setState({
                btn_ingresar: 'btn btn-primary btn-block mb-3',
                btn_actualiazr: 'btn btn-warning btn-block mb-3',
                btn_borrar: 'btn btn-danger btn-block mb-3',
            })
        }else{
            this.setState({
                btn_ingresar: 'btn btn-primary btn-lg mb-3',
                btn_actualiazr: 'btn btn-warning btn-lg mb-3 mx-3',
                btn_borrar: 'btn btn-danger btn-lg mb-3',
            })
        }
    }

    //Btns:
    buttonClickMingresar(){
        this.setState({
            hideDialogNreceta: true
        })
    }
    buttonClickActualizar(){

    }
    buttonClickEliminar(){

    }

    //Row handlers
    onRowSelection() {
        this.setState({
            rowActualizar: this.grid.getSelectedRecords()
        })
    }

    toolbarClick(args) {
        console.log(args.item.text)
        switch (args.item.text) {
            case 'Excel Export':
                this.grid.excelExport();
                break;
        }
    }

    //Grid Settings
    grid;
    checkboxObj;
    toolbarOptions = ['ExcelExport', 'Search'];   
    groupSettings = { showDropArea: false, columns: ['materiaPrima'] };
    template = this.gridTemplate;


    gridTemplate(props){
        console.log('Aqui')
        console.log(props)
        return(
            <>

                <table className="detailtable" style={{ width: "100%" }}>
                    <colgroup>
                        <col style={{ width: "35%" }}/>
                        <col style={{ width: "35%" }}/>
                        <col style={{ width: "30%" }}/>
                    </colgroup>
                 
                    {props.materiaPrimaReceta.map((item, index) => {
                        return(                                                       
                                <tbody>
                                <tr>
                                    <td>
                                        <span style={{ fontWeight: 500 }}>Materia Prima: {item.MateriaPrima}</span> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style={{ fontWeight: 500 }}>Orden: {item.Orden}</span> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style={{ fontWeight: 500 }}>Peso Espesifico: {item.PesoEsp} Kg.</span> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style={{ fontWeight: 500 }}>Peso Maximo: {item.PesoMaximo} Kg.</span> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style={{ fontWeight: 500 }}>Peso Minimo: {item.PesoMinimo} Kg.</span>
                                    </td>
                                </tr>
                                </tbody>
                        )
                    })}
                
                </table>
            </>
        )
    }


    //Dialog Settings

    onBeforeOpen = (args) => {
        if(Browser.isDevice){
            args.maxHeight = '500px';
        }else{
            args.maxHeight = '1000px';
        }
    };

    header(){
        return (<div>
            <span>Ingresar Nueva Receta.</span>
        </div>);
    }

    dialogClose(){
        this.setState({ hideDialogNreceta: false});
    }

    handleIngresarReceta(){

        let flagValidator = true;
        let mpRecetaAux = [];

        console.log(this.state.responsableReceta)
        console.log(this.state.compuestoReceta)
        console.log(this.state.nombreReceta)
        console.log(this.state.tamanioBolsaReceta)   

        if(this.state.responsableReceta === '' || this.state.compuestoReceta === '' || this.state.nombreReceta === '' || this.state.tamanioBolsaReceta === ''){
            flagValidator = false
        }

        this.state.numInputsMP.map((item, index) => {
            console.log(this.state["MP_" + item])
            console.log(this.state["ordenMP_" + item])
            console.log(this.state["pesoEsp_" + item])
            console.log(this.state["pesoMin_" + item])
            console.log(this.state["pesoMax_" + item])

            if(this.state["MP_" + item] === undefined || this.state["ordenMP_" + item] === undefined || this.state["pesoEsp_" + item] === undefined || this.state["pesoMin_" + item] === undefined || this.state["pesoMax_" + item] === undefined){
                flagValidator = false
            }else{
                if(this.state["MP_" + item] === "0" || this.state["ordenMP_" + item] === null || this.state["pesoEsp_" + item] === null || this.state["pesoMin_" + item] === null || this.state["pesoMax_" + item] === null){
                    flagValidator = false
                }else{

                    mpRecetaAux = [...mpRecetaAux, {"MateriaPrima": this.state["MP_" + item], "PesoEsp": this.state["pesoEsp_" + item], "Orden": this.state["ordenMP_" + item], "PesoMaximo": this.state["pesoMax_" + item], "PesoMinimo": this.state["pesoMin_" + item]}]
                
                    this.setState({
                        materiaPrimaReceta: mpRecetaAux
                    })
                }
            }
        })

        if(flagValidator){
            dialogObj = DialogUtility.confirm({
                title: ' Ingresar Nueva Receta',
                content: `Esta seguro que desea ingresar al sistema la receta: ${this.state.nombreReceta}, compuesto:  ${this.state.compuestoReceta}?`,
                okButton: { click: this.confirmOkActionEliminar.bind(this) },
                cancelButton: { click: this.confirmCancelActionEliminar.bind(this) },
                position: { X: 'center', Y: 'center' }
            });
        }else{
            alert('Por favor llene todos los campos !...')
        }
    }

    confirmOkActionEliminar(){

        const fetchOptions = {
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body:JSON.stringify({
                responsableReceta:      this.state.responsableReceta,                  
                compuesto:              this.state.compuestoReceta,         
                receta:                 this.state.nombreReceta,         
                bolsaRecetaTamanio:     this.state.tamanioBolsaReceta,    
                materiaPrimaReceta:     this.state.materiaPrimaReceta       
            })
        }
        fetch('http://localhost:3001/api/leermp', fetchOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })

        dialogObj.hide()
    }

    confirmCancelActionEliminar(){
        dialogObj.hide()
    }

    footerTemplate() {
        return (<div>                   
                    <button id="sendButton" className="btn btn-primary btn-block btn-lg" onClick={() => this.handleIngresarReceta()}>Ingresar Nueva Receta</button>                        
                </div>);
    }

    //Formulario nueva receta

    dialogNewReceta(){
        return(
                <DialogComponent
                    id="DialogIngresarReceta"
                    isModal={true}
                    showCloseIcon={true}
                    width="800px"
                    beforeOpen={this.onBeforeOpen}
                    header={this.header}
                    visible={this.state.hideDialogNreceta}
                    beforeClose={this.dialogClose.bind(this)}
                    footerTemplate={this.footerTemplate.bind(this)} 
                    content={this.content.bind(this)} 
                    statelessTemplates={[]}
                >       
                </DialogComponent>  
        )
    }

    handreNuevosMPrecetas(e){
        
        let contAux = [...this.state.numInputsMP, this.state.contAuxAux]

        this.setState({
            numInputsMP: contAux,
            contAuxAux: this.state.contAuxAux + 1
        })

    }

    handleMateriaPrimaAux(e, item){
        console.log(e.target.value)
        this.setState({
            ["MP_" + item]: e.target.value
        })
    }

    handlePesoEsp(value, index, e){
        e.preventDefault();
        console.log(value, index)
        this.setState({
            ["pesoEsp_" + index]: value
        })
        //
       this["pespEsp_" + index].focus();
    }

    handlePesoMinimo(e){
        console.log(e.target.value)
    }

    handlePesoMaximo(e){
        console.log(e.target.value)
    }

    handleNuevosMPrecetaAux(){
        return(
            <>                    
            
        </>    
        )
    }

    handleRespRecete(e){
        console.log(e.target.value)
        this.setState({
            responsableReceta: e.target.value
        })
    }

    handleCompuesto(e){
        console.log(e.target.value)
        this.setState({
            compuestoReceta: e.target.value
        })
    }

    handleRecetaNombre(e){
        console.log(e.target.value)
        this.setState({
            nombreReceta: e.target.value
        })
    }

    handleTamanioBolsa(e){
        console.log(e.target.value)
        this.setState({
            tamanioBolsaReceta: e.target.value
        })
    }

    content(){
        return(          
            <div>                   
                <div className="mb-3">
                    <label htmlFor="respingresoreceta" className="form-label">Responsable Ingreso Receta.</label>                      
                    <select className="form-control" id="respingresorecetaid" value={this.state.responsableReceta} onChange={(e) => this.handleRespRecete(e)}>
                        <option value="0">Seleccione responsable de creacion de nueva receta.</option>
                        <option value="BERON_01">BERON_01</option>
                        <option value="BERON_02">BERON_02</option>
                        <option value="BERON_03">BERON_03</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="nuevamp" className="form-label">Compuesto Nombre.</label>
                    
                    <TextBoxComponent placeholder="Compuesto Nombre" cssClass="e-outline" value={this.state.compuestoReceta} className="form-control" change={(e) => this.setState({ compuestoReceta: e.value })}/>
                    
                    <div id="mphelp" className="form-text">Condicion para registrar nueva compuesto</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nuevamp" className="form-label">Receta Nombre.</label>

                    <TextBoxComponent placeholder="Receta Nombre" cssClass="e-outline" value={this.state.nombreReceta} className="form-control" change={(e) => this.setState({ nombreReceta: e.value })}/>
                    
                    <div id="mphelp" className="form-text">Condicion para registrar nueva receta</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="respingresomp" className="form-label">Tamaño de la Bolsa.</label>                      
                    <select className="form-control" id="respingresompid" value={this.state.tamanioBolsaReceta} aria-describedby="respmphelp" onChange={(e) => this.handleTamanioBolsa(e)}>
                        <option value="0">Seleccione tamaño de bolsa de receta.</option>
                        <option value="PEQUENIA">PEQUEÑA - 23 gr.</option>
                        <option value="GRANDE">GRANDE - 38 gr.</option>
                    </select>
                </div>

                {/*this.handleNuevosMPrecetaAux()*/}
                
                { this.state.numInputsMP.map((item, index) => {

                return(
                   
                    <div className="materiaPrimaRecetas">
                    <div className="materiaPrima">
                        
                    <label className="form-label">M. P.</label>
                    <select className="form-control" id="respingresompid" value={this.state["MP_" + item]} aria-describedby="respmphelp" onChange={(e) => this.handleMateriaPrimaAux(e, item)}>
                    <option value="0">Seleccione M.P.</option>
                    {this.state.data_mp.map((item, index) => {
                        return(                            
                            <option value={item._id}>{item._id}</option>
                        )
                    })}

                    </select>
                    
                    </div>



                    <div className="pesoEspecifico">
                        <label htmlFor={"pesoEsp_" + index} className="form-label">Peso Especificacion.</label>
                        {/* Render the Numeric Textbox */}
                        <NumericTextBoxComponent format='###.### kg' className="form-label" value={this.state["pesoEsp_" + item]} change={(e) => this.setState({ ["pesoEsp_" + item]: e.value })}>
                        </NumericTextBoxComponent>
                    </div>

                    <div className="orden">
                        <label className="form-label">Orden.</label>
                        <NumericTextBoxComponent format='###' className="form-control" value={this.state["ordenMP_" + item]} change={(e) => this.setState({ ["ordenMP_" + item]: e.value })}>

                        </NumericTextBoxComponent>
                    </div>

                    <div className="pesoMinimo">
                        <label className="form-label">Peso Minimo.</label>
                        {/* Render the Numeric Textbox */}
                        <NumericTextBoxComponent format='###.### kg' className="form-label" value={this.state["pesoMin_" + item]} change={(e) => this.setState({ ["pesoMin_" + item]: e.value })}>
                        </NumericTextBoxComponent>
                    </div>

                    <div className="pesoMaximo">
                        <label className="form-label">Peso Maximo.</label>
                        {/* Render the Numeric Textbox */}
                        <NumericTextBoxComponent format='###.### kg' className="form-label" value={this.state["pesoMax_" + item]} change={(e) => this.setState({ ["pesoMax_" + item]: e.value })}>
                        </NumericTextBoxComponent>
                    </div>

                    <div className="btnBorrad">
                    <label id={"borrar_" + index} className="form-label">Borrar.</label>
                        <button className='btn btn-danger' onClick={(e) => {
                           console.log(item)

                            let dataAux = this.state.numInputsMP
                            let indexAux = this.state.numInputsMP.indexOf(item)                            
                            this.state.numInputsMP.splice(indexAux, 1)
                            //dataAux.pop()
                            
                            this.setState({
                                numInputsMP: dataAux
                            })                            
                        }}>X</button>                        
                    </div>

                    </div>
                )
                })}

                <div id="mphelp" className="form-text">Condicion para ingresar campos de materia prima para la nueva receta</div>

                <button className='btn btn-success mt-2 btn-lg' onClick={ (e) => this.handreNuevosMPrecetas(e) }>Agregar nueva M.P. a receta.</button>

            </div>      
        )
    }

    render() {
        const dialogNewRecetaAux = () => {
            return(
                <DialogComponent
                    id="DialogIngresarReceta"
                    isModal={true}
                    showCloseIcon={true}
                    width="700px"
                    beforeOpen={this.onBeforeOpen}
                    header={this.header}
                    visible={this.state.hideDialogNreceta}
                    beforeClose={this.dialogClose.bind(this)}
                    footerTemplate={this.footerTemplate.bind(this)} 
                    content={this.content.bind(this)} 
                    statelessTemplates={[]}
                >       
                </DialogComponent>  
            )
        }
        return (
            <div className="control-pane">
                <div className="control-section mx-2">                    
                <div className="e-bigger e-adaptive-demo">
                <button className={this.state.btn_ingresar} onClick={this.buttonClickMingresar.bind(this)}>Ingresar MP</button>
                <button className={this.state.btn_actualiazr} onClick={this.buttonClickActualizar.bind(this)}>Actualizar MP</button>
                <button className={this.state.btn_borrar} onClick={this.buttonClickEliminar.bind(this)}>Eliminar MP</button>
                
                    {!Browser.isDevice ? (    
                        <GridComponent
                            GridComponent 
                                id="adaptivebrowser" 
                                dataSource={this.state.data_recetas} 
                                height='100%' 
                                ref={grid => this.grid = grid} 
                                enableAdaptiveUI={true} 
                                rowRenderingMode={this.renderingMode} 
                                allowSorting={true} 
                                allowPaging={true} 
                                toolbar={this.toolbarOptions} 
                                editSettings={this.editSettings} 
                                pageSettings={{ pageCount: 3 }} 
                                load={this.load}
                                detailTemplate={this.template.bind(this)}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="compuesto"
                                    headerText="Compuesto"
                                    width="180"
                                ></ColumnDirective>    
                                <ColumnDirective
                                    field="receta"
                                    headerText="Nombre Receta"
                                    width="180"
                                ></ColumnDirective>     
                                <ColumnDirective
                                    field="bolsaRecetaTamanio"
                                    headerText="Tamaño de Bolsa"
                                    width="180"
                                ></ColumnDirective>   
                                <ColumnDirective
                                    field="responsableReceta"
                                    headerText="Responsable Receta"
                                    width="180"
                                ></ColumnDirective>               
                            </ColumnsDirective>

                            <Inject services={[ Toolbar, Filter, Sort, Edit, Toolbar, Page, Aggregate, Group, Selection, DetailRow ]} />
                        </GridComponent>                  
                    
                    ) : (
                    
                    <GridComponent
                        id="adaptivedevice"
                        dataSource={this.state.data_recetas}
                        height="100%"
                        ref={(grid) => (this.grid = grid)}
                        enableAdaptiveUI={true}
                        rowRenderingMode={"Vertical"}
                        allowSorting={true}
                        allowPaging={true}
                        toolbar={this.toolbarOptions}
                        pageSettings={{ pageCount: 3 }}
                        load={this.load}
                        groupSettings={this.groupSettings}
                        allowGrouping={true}
                        selectionSettings={"Single"}
                        rowSelected={this.onRowSelection.bind(this)}
                    >
                         <ColumnsDirective>
                                <ColumnDirective
                                    field="compuesto"
                                    headerText="Compuesto"
                                    width="180"
                                ></ColumnDirective>    
                                <ColumnDirective
                                    field="receta"
                                    headerText="Nombre Receta"
                                    width="180"
                                ></ColumnDirective>     
                                <ColumnDirective
                                    field="bolsaRecetaTamanio"
                                    headerText="Tamaño de Bolsa"
                                    width="180"
                                ></ColumnDirective>   
                                <ColumnDirective
                                    field="responsableReceta"
                                    headerText="Responsable Receta"
                                    width="180"
                                ></ColumnDirective>               
                            </ColumnsDirective>

                            <Inject services={[Filter, Sort, Edit, Toolbar, Page, Group]} />
                    </GridComponent>
                    )}
                </div>
                </div>

                {dialogNewRecetaAux()}

                </div>
        );
    }

    load() {
        this.adaptiveDlgTarget =
        document.getElementsByClassName('e-mobile-content')[0];
    }
}

export default SeguimientoRecetas;