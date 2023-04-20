import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
    Aggregate, Group, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective,
  } from '@syncfusion/ej2-react-grids';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-react-popups';
import { Browser } from '@syncfusion/ej2-base';
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Page as PagePdf, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import '../../App.css';

import ReactToPrint from 'react-to-print';
import MpinputPdf from '../reporting/mpinputPdf';

import FlagGreen from '../../images/flagGreen.png';
import FlagRed from '../../images/flagRed.png';
import FlagYellow from '../../images/yellowFlag.png';
import PdfMP from '../../images/pdfMPblack.png';
import BestImg from '../../images/bestIconoSolo.png';

let dialogObj;


class SeguimientoInsumos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMp: [],
            renderingMode: 'Vertical',
            btn_ingresar: '',
            btn_actualiazr: '',
            btn_borrar: '',
            btn_imprimir: '',
            hideDialog: false,
            hideDialogActualizar: false,
            hideDialogPdf: false,
            materiaPrima: '',                        
            pesoMateriaPrimaStock: '',                     
            loteMateriaPrima: '',                      
            pesoBulto: '',                             
            bultosEstiba: '',                         
            fechaEntrada: '',                          
            fechaVencimiento: '',                       
            responsableRecepcion: '',
            newmphelper: 'Condicion para ingresar nueva M.P.',
            rowActualizar: [],
            mp_id_actualizacion: '',    
            regextencionfechavencimiento: false,
            dataPDF:[],
            opcionPDF:false
            }

        this.animationSettings = { effect: 'Zoom' };

        this.handleIngresoMP = this.handleIngresoMP.bind(this);
        this.handleActualizarMP = this.handleActualizarMP.bind(this);
    }
    
    componentDidMount(){
        //Leemos la materia prima
        const requestOptions ={
            method: 'GET',
            headers : {'Content-type':'application/json'},    
          }      
          fetch('http://localhost:3001/api/newmp', requestOptions)
              .then(response => response.json())
              .then(mp => {
                    console.log(mp.mps)
                    this.setState({
                        dataMp: mp.mps
                    })
              })
              .catch(err => console.log(err))
        //Miramos si estamos desde un celular
        console.log(Browser.isDevice)
        if(Browser.isDevice){
            this.setState({
                btn_ingresar: 'btn btn-primary btn-block mb-3',
                btn_actualiazr: 'btn btn-warning btn-block mb-3',
                btn_borrar: 'btn btn-danger btn-block mb-3',
                btn_imprimir: 'btn btn-info btn-block mb-3',
            })
        }else{
            this.setState({
                btn_ingresar: 'btn btn-primary btn-lg mb-3',
                btn_actualiazr: 'btn btn-warning btn-lg mb-3 mx-3',
                btn_borrar: 'btn btn-danger btn-lg mb-3',
                btn_imprimir: 'btn btn-info btn-lg mb-3 mx-3',
            })
        }
    }

    //Tabla de MP
    grid;
    checkboxObj;
    toolbarOptions = ['ExcelExport', 'Search'];   
    groupSettings = { showDropArea: false, columns: ['materiaPrima'] };

    load() {
        this.adaptiveDlgTarget =
        document.getElementsByClassName('e-mobile-content')[0];
    }

    groupcFootertMax(props) {

        let loc = { width: '31px', height: '24px' };
        let flagAux = ''
        if(props.Sum > 800){
            flagAux = FlagGreen;
        }else if(props.Sum <= 800 && props.Sum > 300){
            flagAux = FlagYellow;
        }else if(props.Sum <= 300){
            flagAux = FlagRed;
        }

        return (
            <div> <img style={loc} src={flagAux}/>
            <span> Total Disponible M.P.: {props.Sum} </span>
            </div>
        );
    }

    extencionFechaVencimiento(props){
        if(props.tieneExtencionFechaVencimiento){
            return(
                <div>
                    <span>SI</span>
                </div>
            )
        }else{
            return(
                <div>
                    <span>NO</span>
                </div>
            )
        }
    }

    mpDiffVencimientoTemplate(props){
        let fechaHoy = new Date();
        let date 
        date = fechaHoy.getFullYear()+'-'+(fechaHoy.getMonth()+1)+'-'+fechaHoy.getDate();

        let fechaVencimiento = props.fechaVencimiento.split(",").pop();


        let fechaDif = Math.ceil((new Date(fechaVencimiento) - new Date(date)) / (1000*60*60*24))
        
        return (
            <div>            

            {(() => {
                if (fechaDif > 5) {
                return (
                    <div id="status" className="statustemp e-activecolor">
                        <span className="statustxt e-activecolor">{fechaDif} Disponible</span>
                    </div>
                )
                } else if (fechaDif <= 5 && fechaDif > 0) {
                return (
                    <div id="status" className="statustemp e-transinactivecolor">
                        <span className="statustxt e-transinactivecolor">{fechaDif} Casi-Vencido</span>
                    </div>
                )
                } else {
                return (
                    <div id="status" className="statustemp e-inactivecolor">
                        <span className="statustxt e-inactivecolor">{fechaDif} Vencido</span>
                    </div>
                )
                }
            })()}

            </div>
        );
    }

    fechaEntradaTemplate(props){
        let fechaEntrada = props.fechaEntrada;
        return (
            <div>
            <span> {fechaEntrada.split('T')[0]} </span>
            </div>
        );
    }

    fechaVencimientoTemplate(props){

        let fechaVencimiento = props.fechaVencimiento;
        return (
            <div>
            <span> {fechaVencimiento.split(',').pop()} </span>
            </div>
        );
    }

    //Dialogo
    animationSettings;
    defaultDialogInstance;

    dialogClose() {
        this.setState({ hideDialog: false });
    }

    dialogCloseActualizar(){
        this.setState({ hideDialogActualizar: false });
    }

    dialogClosePdf(){
        this.setState({ hideDialogPdf: false , opcionPDF:false});
    }

    buttonClickMingresar(){
        this.setState({
            hideDialog: true
        })
    }

    buttonClickActualizar(){
        console.log(this.grid.getSelectedRecords());

        if(this.grid.getSelectedRecords().length === 0){

        }else{
            this.setState({
                mp_id_actualizacion: this.grid.getSelectedRecords()[0]._id,
                responsableRecepcion: this.grid.getSelectedRecords()[0].responsableRecepcion,
                materiaPrima: this.grid.getSelectedRecords()[0].materiaPrima,
                loteMateriaPrima: this.grid.getSelectedRecords()[0].loteMateriaPrima,                
                pesoMateriaPrimaStock: this.grid.getSelectedRecords()[0].pesoMateriaPrimaStock,
                pesoBulto: this.grid.getSelectedRecords()[0].pesoBulto,
                bultosEstiba: this.grid.getSelectedRecords()[0].bultosEstiba,
                fechaEntrada: this.grid.getSelectedRecords()[0].fechaEntrada.split('T')[0],
                fechaVencimiento: this.grid.getSelectedRecords()[0].fechaVencimiento.split(',').pop(),
                regextencionfechavencimiento: this.grid.getSelectedRecords()[0].tieneExtencionFechaVencimiento,
                fechaVencimientoExtencion: this.grid.getSelectedRecords()[0].fechaVencimiento.split(',').pop(),
            })

            if(this.grid.getSelectedRecords()[0].tieneExtencionFechaVencimiento){
                document.getElementById("fechavencimientompidactualizar").disabled = true;
                document.getElementById("fechavencimientoextencionmpidactualizar").disabled = false;

                document.getElementById("nuevampidactualizar").value = this.grid.getSelectedRecords()[0].materiaPrima;
                document.getElementById("nuevolotempidactualizar").value = this.grid.getSelectedRecords()[0].loteMateriaPrima;
                document.getElementById("pesoentradampidactualizar").value = this.grid.getSelectedRecords()[0].pesoMateriaPrimaStock;
                document.getElementById("pesobultosstivampidactualizar").value = this.grid.getSelectedRecords()[0].pesoBulto;
                document.getElementById("numbultosstivampidactualizar").value = this.grid.getSelectedRecords()[0].bultosEstiba;
                document.getElementById("fechaentradampidactualizar").value = this.grid.getSelectedRecords()[0].fechaEntrada.split('T')[0];
                document.getElementById("fechavencimientoextencionmpidactualizar").value = this.grid.getSelectedRecords()[0].fechaVencimiento.split(',').pop();
                document.getElementById("respingresompidactualizar").value = this.grid.getSelectedRecords()[0].responsableRecepcion
                document.getElementById("flexSwitchCheckDefault").checked = this.grid.getSelectedRecords()[0].tieneExtencionFechaVencimiento

            }else{
                document.getElementById("fechavencimientompidactualizar").disabled = false;
                document.getElementById("fechavencimientoextencionmpidactualizar").disabled = true;

                document.getElementById("nuevampidactualizar").value = this.grid.getSelectedRecords()[0].materiaPrima;
                document.getElementById("nuevolotempidactualizar").value = this.grid.getSelectedRecords()[0].loteMateriaPrima;
                document.getElementById("pesoentradampidactualizar").value = this.grid.getSelectedRecords()[0].pesoMateriaPrimaStock;
                document.getElementById("pesobultosstivampidactualizar").value = this.grid.getSelectedRecords()[0].pesoBulto;
                document.getElementById("numbultosstivampidactualizar").value = this.grid.getSelectedRecords()[0].bultosEstiba;
                document.getElementById("fechaentradampidactualizar").value = this.grid.getSelectedRecords()[0].fechaEntrada.split('T')[0];
                document.getElementById("fechavencimientompidactualizar").value = this.grid.getSelectedRecords()[0].fechaVencimiento;
                document.getElementById("respingresompidactualizar").value = this.grid.getSelectedRecords()[0].responsableRecepcion
                document.getElementById("flexSwitchCheckDefault").checked = this.grid.getSelectedRecords()[0].tieneExtencionFechaVencimiento
            }

            this.setState({
                hideDialogActualizar: true
            })
        }        
    }

    buttonClickEliminar(){
        console.log(this.grid.getSelectedRecords());

        if(this.grid.getSelectedRecords().length === 0){

        }else{
            this.setState({
                mp_id_actualizacion: this.grid.getSelectedRecords()[0]._id,
            })            

            dialogObj = DialogUtility.confirm({
                title: ' Eliminar Materia Prima',
                content: `Esta seguro que desea eliminar al sistema la M.P.: ${this.grid.getSelectedRecords()[0].materiaPrima}, lote:  ${this.grid.getSelectedRecords()[0].loteMateriaPrima}?`,
                okButton: { click: this.confirmOkActionEliminar.bind(this) },
                cancelButton: { click: this.confirmCancelActionEliminar.bind(this) },
                position: { X: 'center', Y: 'center' }
            });
        }  
    }

    header() {
        return (<div>
                    <span>Formulario de Resgistro de M.P</span>
                </div>);
    }

    headerActualizar() {
        return (<div>
                    <span>Formulario para Actualizar de M.P</span>
                </div>);
    }

    headerImprimirPDF(){
        return (<div>
            <span>Impresion de Rotulo M.P.</span>
        </div>);
    }

    headerPdf(){
        return (<div>
                    <ReactToPrint
                        trigger={() => {
                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                            // to the root node of the returned component as it will be overwritten.
                            return (                                
                                    <a href='#'>Imprimir...</a>
                                                
                            );
                        }}
                        content={() => this.componentRef}
                        />
                </div>);
    }

    onBeforeOpen = (args) => {
        if(Browser.isDevice){
            args.maxHeight = '500px';
        }else{
            args.maxHeight = '1000px';
        }
    };

    handleIngresoMP(){
        console.log("Info de entrada:....")
        console.log(this.state.materiaPrima)                       
        console.log(this.state.pesoMateriaPrimaStock)                      
        console.log(this.state.loteMateriaPrima)                       
        console.log(this.state.pesoBulto)                              
        console.log(this.state.bultosEstiba)                           
        console.log(this.state.fechaEntrada)                           
        console.log(this.state.fechaVencimiento)            
        console.log(this.state.responsableRecepcion) 
        
        if( this.state.materiaPrima === '' || this.state.pesoMateriaPrimaStock === '' || this.state.loteMateriaPrima === '' || this.state.pesoBulto === '' || this.state.bultosEstiba === '' || this.state.fechaEntrada === '' || this.state.fechaVencimiento === '' || this.state.responsableRecepcion === '' ){
            alert('Porfavor coloque todos los campos...')
        } else {
            dialogObj = DialogUtility.confirm({
                title: ' Ingreso de Materia Prima',
                content: `Esta seguro que desea ingresar al sistema la M.P.: ${this.state.materiaPrima} ?`,
                okButton: { click: this.confirmOkAction.bind(this) },
                cancelButton: { click: this.confirmCancelAction.bind(this) },
                position: { X: 'center', Y: 'center' }
            });
        }
    }

    handleActualizarMP(){
        console.log("Info de entrada actualizacion:....")
        console.log(this.state.materiaPrima)                       
        console.log(this.state.pesoMateriaPrimaStock)                      
        console.log(this.state.loteMateriaPrima)                       
        console.log(this.state.pesoBulto)                              
        console.log(this.state.bultosEstiba)                           
        console.log(this.state.fechaEntrada)                           
        console.log(this.state.fechaVencimiento)            
        console.log(this.state.responsableRecepcion)

        console.log(this.state.regextencionfechavencimiento)

        if( this.state.materiaPrima === '' || this.state.pesoMateriaPrimaStock === '' || this.state.loteMateriaPrima === '' || this.state.pesoBulto === '' || this.state.bultosEstiba === '' || this.state.fechaEntrada === '' || this.state.fechaVencimiento === '' || this.state.responsableRecepcion === '' ){
            alert('Porfavor coloque todos los campos...')
        } else {
            dialogObj = DialogUtility.confirm({
                title: ' Ingreso de Materia Prima',
                content: `Esta seguro que desea actualizar al sistema la M.P.: ${this.state.materiaPrima} ?`,
                okButton: { click: this.confirmOkActionActualizar.bind(this) },
                cancelButton: { click: this.confirmCancelActionActualizar.bind(this) },
                position: { X: 'center', Y: 'center' }
            });
        }
    }

    confirmOkAction() {
        //
        const requestOptions ={
            method: 'POST',
            headers : {'Content-type':'application/json'},
            body: JSON.stringify({materiaPrima : this.state.materiaPrima,                    
                pesoMateriaPrimaStock : this.state.pesoMateriaPrimaStock,                     
                loteMateriaPrima : this.state.loteMateriaPrima,                       
                pesoBulto : this.state.pesoBulto,                             
                bultosEstiba : this.state.bultosEstiba,                           
                fechaEntrada : this.state.fechaEntrada,                           
                fechaVencimiento : this.state.fechaVencimiento,           
                responsableRecepcion : this.state.responsableRecepcion})    
        }      
        fetch('http://localhost:3001/api/newmp', requestOptions)
            .then(response => response.json())
            .then(mp => {                  

                const requestOptionsRefresh ={
                    method: 'GET',
                    headers : {'Content-type':'application/json'},    
                }      
                fetch('http://localhost:3001/api/newmp', requestOptionsRefresh)
                    .then(response => response.json())
                    .then(mp => {
                            
                            this.setState({
                                dataMp: mp.mps,
                                materiaPrima : '',                    
                                pesoMateriaPrimaStock : '',                     
                                loteMateriaPrima : '',                       
                                pesoBulto : '',                             
                                bultosEstiba : '',                           
                                fechaEntrada : '',                           
                                fechaVencimiento : '',           
                                responsableRecepcion : ''
                            })

                            this.dialogClose()

                            document.getElementById("nuevampid").value = "";
                            document.getElementById("nuevolotempid").value = "";
                            document.getElementById("pesoentradampid").value = "";
                            document.getElementById("pesobultosstivampid").value = "";
                            document.getElementById("numbultosstivampid").value = "";
                            document.getElementById("fechaentradampid").value = "";
                            document.getElementById("fechavencimientompid").value = "";
          })
          .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
        
        //
        dialogObj.hide();
    }

    confirmOkActionEliminar(){
        const requestOptions ={
            method: 'DELETE',
            headers : {'Content-type':'application/json'},
        }      
        fetch('http://localhost:3001/api/newmp/' + this.state.mp_id_actualizacion, requestOptions)
            .then(response => response.json())
            .then(mp => {                  

                const requestOptionsRefresh ={
                    method: 'GET',
                    headers : {'Content-type':'application/json'},    
                }      
                fetch('http://localhost:3001/api/newmp', requestOptionsRefresh)
                    .then(response => response.json())
                    .then(mp => {
                            
                            this.setState({
                                dataMp: mp.mps
                            })
                           
                    })
                    .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
        
        //
        dialogObj.hide();
    }

    confirmOkActionActualizar(){
        //
        if(this.state.regextencionfechavencimiento){
            if(this.state.fechaVencimientoExtencion === ''){
                
            }else{
                const requestOptions ={
                    method: 'PUT',
                    headers : {'Content-type':'application/json'},
                    body: JSON.stringify({   
                        materiaPrima : this.state.materiaPrima,                    
                        pesoMateriaPrimaStock : this.state.pesoMateriaPrimaStock,                     
                        loteMateriaPrima : this.state.loteMateriaPrima,                       
                        pesoBulto : this.state.pesoBulto,                             
                        bultosEstiba : this.state.bultosEstiba,                           
                        fechaEntrada : this.state.fechaEntrada,                
                        responsableRecepcion : this.state.responsableRecepcion,
                        tieneExtencionFechaVencimiento : this.state.regextencionfechavencimiento,   
                        fechaVencimientoExtencion : this.state.fechaVencimientoExtencion
                    })    
                }      
                fetch('http://localhost:3001/api/newmp/' + this.state.mp_id_actualizacion, requestOptions)
                    .then(response => response.json())
                    .then(mp => {                  
        
                        const requestOptionsRefresh ={
                            method: 'GET',
                            headers : {'Content-type':'application/json'},    
                        }      
                        fetch('http://localhost:3001/api/newmp', requestOptionsRefresh)
                            .then(response => response.json())
                            .then(mp => {
                                    
                                    this.setState({
                                        dataMp: mp.mps,
                                    })
        
                                    this.dialogCloseActualizar()
        
                                    document.getElementById("nuevampidactualizar").value = "";
                                    document.getElementById("nuevolotempidactualizar").value = "";
                                    document.getElementById("pesoentradampidactualizar").value = "";
                                    document.getElementById("pesobultosstivampidactualizar").value = "";
                                    document.getElementById("numbultosstivampidactualizar").value = "";
                                    document.getElementById("fechaentradampidactualizar").value = "";
                                    document.getElementById("fechavencimientompidactualizar").value = "";
                                    document.getElementById("fechavencimientoextencionmpidactualizar").value = "";
        
                  })
                  .catch(err => console.log(err))
                  })
                  .catch(err => console.log(err))            
                //
                dialogObj.hide();
            }

        }else{
            const requestOptions ={
                method: 'PUT',
                headers : {'Content-type':'application/json'},
                body: JSON.stringify({
                    materiaPrima : this.state.materiaPrima,                    
                    pesoMateriaPrimaStock : this.state.pesoMateriaPrimaStock,                     
                    loteMateriaPrima : this.state.loteMateriaPrima,                       
                    pesoBulto : this.state.pesoBulto,                             
                    bultosEstiba : this.state.bultosEstiba,                           
                    fechaEntrada : this.state.fechaEntrada,                           
                    fechaVencimiento : this.state.fechaVencimiento,           
                    responsableRecepcion : this.state.responsableRecepcion,
                    tieneExtencionFechaVencimiento : this.state.regextencionfechavencimiento})    
            }      
            fetch('http://localhost:3001/api/newmp/' + this.state.mp_id_actualizacion, requestOptions)
                .then(response => response.json())
                .then(mp => {                  
    
                    const requestOptionsRefresh ={
                        method: 'GET',
                        headers : {'Content-type':'application/json'},    
                    }      
                    fetch('http://localhost:3001/api/newmp', requestOptionsRefresh)
                        .then(response => response.json())
                        .then(mp => {
                                
                                this.setState({
                                    dataMp: mp.mps,
                                    materiaPrima : '',                    
                                    pesoMateriaPrimaStock : '',                     
                                    loteMateriaPrima : '',                       
                                    pesoBulto : '',                             
                                    bultosEstiba : '',                           
                                    fechaEntrada : '',                           
                                    fechaVencimiento : '',           
                                    responsableRecepcion : ''
                                })
    
                                this.dialogCloseActualizar()
    
                                document.getElementById("nuevampidactualizar").value = "";
                                document.getElementById("nuevolotempidactualizar").value = "";
                                document.getElementById("pesoentradampidactualizar").value = "";
                                document.getElementById("pesobultosstivampidactualizar").value = "";
                                document.getElementById("numbultosstivampidactualizar").value = "";
                                document.getElementById("fechaentradampidactualizar").value = "";
                                document.getElementById("fechavencimientompidactualizar").value = "";
                                document.getElementById("fechavencimientoextencionmpidactualizar").value = "";
    
              })
              .catch(err => console.log(err))
              })
              .catch(err => console.log(err))            
            //
            dialogObj.hide();
        }
    }

    confirmCancelAction() {
        //
        this.setState({
            materiaPrima : '',                    
            pesoMateriaPrimaStock : '',                     
            loteMateriaPrima : '',                       
            pesoBulto : '',                             
            bultosEstiba : '',                           
            fechaEntrada : '',                           
            fechaVencimiento : '',           
            responsableRecepcion : ''
        })

        document.getElementById("nuevampid").value = "";
        document.getElementById("nuevolotempid").value = "";
        document.getElementById("pesoentradampid").value = "";
        document.getElementById("pesobultosstivampid").value = "";
        document.getElementById("numbultosstivampid").value = "";
        document.getElementById("fechaentradampid").value = "";
        document.getElementById("fechavencimientompid").value = "";
        document.getElementById("respingresompid").value = "0";

        this.dialogClose()
        dialogObj.hide();
    }

    confirmCancelActionEliminar(){
        dialogObj.hide();
    }

    confirmCancelActionActualizar(){
        //
        this.setState({
            materiaPrima : '',                    
            pesoMateriaPrimaStock : '',                     
            loteMateriaPrima : '',                       
            pesoBulto : '',                             
            bultosEstiba : '',                           
            fechaEntrada : '',                           
            fechaVencimiento : '',           
            responsableRecepcion : ''
        })

        document.getElementById("nuevampid").value = "";
        document.getElementById("nuevolotempid").value = "";
        document.getElementById("pesoentradampid").value = "";
        document.getElementById("pesobultosstivampid").value = "";
        document.getElementById("numbultosstivampid").value = "";
        document.getElementById("fechaentradampid").value = "";
        document.getElementById("fechavencimientompid").value = "";
        document.getElementById("respingresompid").value = "0";

        document.getElementById("nuevampidactualizar").value = "";
        document.getElementById("nuevolotempidactualizar").value = "";
        document.getElementById("pesoentradampidactualizar").value = "";
        document.getElementById("pesobultosstivampidactualizar").value = "";
        document.getElementById("numbultosstivampidactualizar").value = "";
        document.getElementById("fechaentradampidactualizar").value = "";
        document.getElementById("fechavencimientompidactualizar").value = "";
        document.getElementById("fechavencimientoextencionmpidactualizar").value = "";

        this.dialogCloseActualizar()
        dialogObj.hide();
    }

    footerTemplate() {

        return (<div>                   
                    <button id="sendButton" className="btn btn-primary btn-block btn-lg" onClick={this.handleIngresoMP}>Ingresar Materia Prima</button>                        
                </div>);
    }

    footerTemplateActualizar() {

        return (<div>                   
                    <button id="sendButton" className="btn btn-warning btn-block btn-lg" onClick={this.handleActualizarMP}>Actualizar Materia Prima</button>
                </div>);
    }

    footerTemplatePdf(){
        return (<div>                   
            <ReactToPrint
                trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                            <a href='#' className="pe-auto">Imprimir....</a>                 
                        );
                }}
                content={() => this.componentRef}
                />
        </div>);
    }

    content(){
        return(
            <div>                   
            <div className="mb-3">
                <label htmlFor="respingresomp" className="form-label">Responsable Ingreso M.P.</label>                      
                <select className="form-control" id="respingresompid" aria-describedby="respmphelp" onChange={(e) => this.setState({ responsableRecepcion: e.target.value })}>
                    <option value="0">Seleccione responsable de recepcion de M.P.</option>
                    <option value="BERON_01">BERON_01</option>
                    <option value="BERON_02">BERON_02</option>
                    <option value="BERON_03">BERON_03</option>
                </select>
                <div id="respmphelp" className="form-text">Condicion para ingresar responsable M.P.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="nuevamp" className="form-label">Referencia M.P.</label>
                <input id="nuevampid" type="text" className="form-control" aria-describedby="mphelp" onChange={this.mpentradavalidacion.bind(this)}/>
                <div id="mphelp" className="form-text">{this.state.newmphelper}</div>
            </div>
            <div className="mb-3">
                <label htmlFor="nuevolotemp" className="form-label">Lote M.P.</label>
                <input type="text" className="form-control" id="nuevolotempid" aria-describedby="mplotehelp" onChange={(e) => this.setState({ loteMateriaPrima: e.target.value })}/>
                <div id="mplotehelp" className="form-text">Condicion para ingresar lote M.P.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="pesoentradamp" className="form-label">Peso Ingreso M.P.</label>
                <input type="number" className="form-control" id="pesoentradampid" aria-describedby="pesoentradahelp" onChange={(e) => this.setState({ pesoMateriaPrimaStock: e.target.value })}/>
                <div id="pesoentradahelp" className="form-text">Condicion para ingresar peso M.P. en Kilogramos</div>
            </div>
            <div className="mb-3">
                <label htmlFor="pesobultosstivamp" className="form-label">Numero de Bultos por Estivas</label>
                <input type="number" className="form-control" id="pesobultosstivampid" aria-describedby="numerobultosstivashelp" onChange={(e) => this.setState({ bultosEstiba: e.target.value })}/>
                <div id="pesobultosstivashelp" className="form-text">Condicion para ingresar numero de bultos por estivas</div>
            </div>
            <div className="mb-3">
                <label htmlFor="numbultosstivamp" className="form-label">Peso de Bulto M.P.</label>
                <input type="number" className="form-control" id="numbultosstivampid" aria-describedby="pesobultosstivashelp" onChange={(e) => this.setState({ pesoBulto: e.target.value })}/>
                <div id="numerobultosstivashelp" className="form-text">Condicion para ingresar peso de peso de bulto de M.P.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="fechaentradamp" className="form-label">Fecha de Entrada M.P.</label>
                <input type="date" className="form-control" id="fechaentradampid" aria-describedby="fechanetradahelp" onChange={(e) => this.setState({ fechaEntrada: e.target.value })}/>
                <div id="fechanetradahelp" className="form-text">Fecha de ingreso de materia prima</div>
            </div>
            <div className="mb-3">
                <label htmlFor="fechavencimientomp" className="form-label">Fecha de Vencimiento M.P.</label>
                <input type="date" className="form-control" id="fechavencimientompid" aria-describedby="fechavencimientohelp" onChange={(e) => this.setState({ fechaVencimiento: e.target.value })}/>
                <div id="fechavencimientohelp" className="form-text">Fecha de vencimiento de materia prima</div>
            </div>           
            </div>
        )
    }

    contentActualizar(){
        return(
            <div>  
                <div className="mb-3">
                <label htmlFor="respingresomp" className="form-label">Responsable Ingreso M.P.</label>                      
                <select className="form-control" id="respingresompidactualizar" aria-describedby="respmphelp" onChange={(e) => this.setState({ responsableRecepcion: e.target.value })}>
                    <option value="0">Seleccione responsable de recepcion de M.P.</option>
                    <option value="BERON_01">BERON_01</option>
                    <option value="BERON_02">BERON_02</option>
                    <option value="BERON_03">BERON_03</option>
                </select>
                <div id="respmphelp" className="form-text">Condicion para ingresar responsable M.P.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nuevamp" className="form-label">Referencia M.P.</label>
                    <input id="nuevampidactualizar" type="text" className="form-control" aria-describedby="mphelpactualizar" onChange={this.mpentradavalidacion.bind(this)}/>
                    <div id="mphelpactualizar" className="form-text">{this.state.newmphelper}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nuevolotemp" className="form-label">Lote M.P.</label>
                    <input type="text" className="form-control" id="nuevolotempidactualizar" aria-describedby="mplotehelpactualizar" onChange={(e) => this.setState({ loteMateriaPrima: e.target.value })}/>
                    <div id="mplotehelpactualizar" className="form-text">Condicion para ingresar lote M.P.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="pesoentradamp" className="form-label">Peso Ingreso M.P.</label>
                    <input type="number" className="form-control" id="pesoentradampidactualizar" aria-describedby="pesoentradahelpactualizar" onChange={(e) => this.setState({ pesoMateriaPrimaStock: e.target.value })}/>
                    <div id="pesoentradahelpactualizar" className="form-text">Condicion para ingresar peso M.P. en Kilogramos</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="pesobultosstivamp" className="form-label">Numero de Bultos por Estivas</label>
                    <input type="number" className="form-control" id="pesobultosstivampidactualizar" aria-describedby="numerobultosstivashelpactualizar" onChange={(e) => this.setState({ bultosEstiba: e.target.value })}/>
                    <div id="pesobultosstivashelpactualizar" className="form-text">Condicion para ingresar numero de bultos por estivas</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="numbultosstivamp" className="form-label">Peso de Bulto M.P.</label>
                    <input type="number" className="form-control" id="numbultosstivampidactualizar" aria-describedby="pesobultosstivashelpactualizar" onChange={(e) => this.setState({ pesoBulto: e.target.value })}/>
                    <div id="numerobultosstivashelpactualizar" className="form-text">Condicion para ingresar peso de peso de bulto de M.P.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="fechaentradamp" className="form-label">Fecha de Entrada M.P.</label>
                    <input type="date" className="form-control" id="fechaentradampidactualizar" aria-describedby="fechanetradahelpactualizar" onChange={(e) => this.setState({ fechaEntrada: e.target.value })}/>
                    <div id="fechanetradahelpactualizar" className="form-text">Fecha de ingreso de materia prima</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="fechavencimientomp" className="form-label">Fecha de Vencimiento M.P.</label>
                    <input type="date" className="form-control" id="fechavencimientompidactualizar" aria-describedby="fechavencimientohelpactualizar" onChange={(e) => this.setState({ fechaVencimiento: e.target.value })}/>
                    <div id="fechavencimientohelpactualizar" className="form-text">Fecha de vencimiento de materia prima</div>
                </div> 

                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e) => {
                        this.setState({
                            regextencionfechavencimiento: document.getElementById("flexSwitchCheckDefault").checked
                        })
                        if(document.getElementById("flexSwitchCheckDefault").checked){
                            document.getElementById("fechavencimientoextencionmpidactualizar").disabled = false
                        }else{
                            document.getElementById("fechavencimientoextencionmpidactualizar").disabled = true
                        }
                        }}/>
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Registrar Extencion de Vencimiento</label>
                </div>

                <div className="mb-3">
                    <label htmlFor="fechavencimientoextencionmp" className="form-label">Fecha de Vencimiento M.P. Extencion</label>
                    <input disabled type="date" className="form-control" id="fechavencimientoextencionmpidactualizar" aria-describedby="fechavencimientoextencionhelpactualizar" onChange={(e) => this.setState({ fechaVencimientoExtencion: e.target.value })}/>
                    <div id="fechavencimientoextencionhelpactualizar" className="form-text">Fecha de extencion de vencimiento de materia prima</div>
                </div> 
            </div>
        )
    }

    //Funcion para validar si ya existe la misma materia prima.
    mpentradavalidacion(e){
        this.setState({
            materiaPrima: e.target.value
        })
        //**
        if(e.target.value === ''){

        }else{
            const requestOptions ={
                method: 'GET',
                headers : {'Content-type':'application/json'},    
              }      
              fetch('http://localhost:3001/api/mpvalidate/' + e.target.value, requestOptions)
                  .then(response => response.json())
                  .then(mp => {                    
                        if(mp.mps.length === 0){
                            document.getElementById('mphelp').innerHTML = "No existe M.P con referencia: " + e.target.value;
                            document.getElementById('mphelp').style.color = 'red';
                            document.getElementById('mphelp').style.fontWeight = 'bold';
                        }else{
                            document.getElementById('mphelp').innerHTML = "Existe M.P con referencia: " + e.target.value;
                            document.getElementById('mphelp').style.color = 'green';
                            document.getElementById('mphelp').style.fontWeight = 'bold';
                        }
                  })
                  .catch(err => console.log(err))
        }        
    }

    //
    onRowSelection() {
        this.setState({
            rowActualizar: this.grid.getSelectedRecords()
        })
    }

    //
    buttonImprimirRotulo(){
        this.setState({
            opcionPDF:true,
            hideDialogPdf: true,
            dataPDF: this.grid.getSelectedRecords()
        })
    }

    pdfContenido(){
        return(
            <MpinputPdf ref={el => (this.componentRef = el)} data={this.state.dataPDF} />
        )
    }

    pdfDialog(){

        return(
            <>
                {(() => {
                    switch (this.state.opcionPDF) {
                    case false:
                        return(<></>)
                    case true:
                        return(
                            <DialogComponent
                            id="AnimationDialog2"
                            isModal={true}
                            showCloseIcon={true}
                            width="900px"
                            beforeOpen={this.onBeforeOpen}
                            header={this.headerImprimirPDF}
                            visible={this.state.hideDialogPdf}
                            beforeClose={this.dialogClosePdf.bind(this)}
                            footerTemplate={this.footerTemplatePdf.bind(this)} 
                            content={this.pdfContenido.bind(this)} 
        
                            >       
                            </DialogComponent> 
                        )                    
                    default:
                        return null;
                    }
                })()}            
            </>
        )
    }

    toolbarClick(args) {
        console.log(args.item.text)
        switch (args.item.text) {
            case 'Excel Export':
                this.grid.excelExport();
                break;
        }
    }

    render() {        
        return (
            
            <div className="control-pane">
                <div className="control-section mx-2">                    
                <div className="e-bigger e-adaptive-demo">
                <button className={this.state.btn_ingresar} onClick={this.buttonClickMingresar.bind(this)}>Ingresar MP</button>
                <button className={this.state.btn_actualiazr} onClick={this.buttonClickActualizar.bind(this)}>Actualizar MP</button>
                <button className={this.state.btn_borrar} onClick={this.buttonClickEliminar.bind(this)}>Eliminar MP</button>
                <button className={this.state.btn_imprimir} onClick={this.buttonImprimirRotulo.bind(this)}>Imprimir Rotulo MP</button>
                    {!Browser.isDevice ? (    
                        <GridComponent
                            id="adaptivebrowser"
                            dataSource={this.state.dataMp}
                            height="100%"
                            ref={(grid) => (this.grid = grid)}
                            enableAdaptiveUI={true}
                            rowRenderingMode={"Horizontal"}
                            allowSorting={true}
                            allowPaging={true}
                            toolbar={this.toolbarOptions}
                            pageSettings={{ pageCount: 3 }}
                            load={this.load}
                            groupSettings={this.groupSettings}
                            allowGrouping={true}
                            selectionSettings={"Single"}
                            rowSelected={this.onRowSelection.bind(this)}
                            toolbarClick={this.toolbarClick.bind(this)}
                            allowExcelExport={true}
                        >
                            <ColumnsDirective>
                            <ColumnDirective
                                field="consecutivo"
                                headerText="Consecutivo MP"
                                width="180"
                                isPrimaryKey={true}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="materiaPrima"
                                headerText="Nombre M.P."
                                width="180"
                            />
                            <ColumnDirective
                                field="loteMateriaPrima"
                                headerText="lote MP"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="pesoMateriaPrimaStock"
                                headerText="Peso MP Disponible"
                                width="280"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="pesoBulto"
                                headerText="Peso Bulto MP"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="bultosEstiba"
                                headerText="# Bultos Estivas"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="fechaEntrada"
                                headerText="Fecha Entrada"
                                width="150"
                                template={this.fechaEntradaTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="fechaVencimiento"
                                headerText="Fecha Vencimiento"
                                width="250"
                                template={this.fechaVencimientoTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                
                                headerText="M.P. Disponible o Vencida"
                                width="240"
                                template={this.mpDiffVencimientoTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="responsableRecepcion"
                                headerText="Responsable Recepcion"
                                width="220"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="tieneExtencionFechaVencimiento"
                                headerText="Tiene Extencion de F.V"
                                width="250"
                                template={this.extencionFechaVencimiento}
                            ></ColumnDirective>
                            </ColumnsDirective>

                            <AggregatesDirective>
                                <AggregateDirective>
                                    <AggregateColumnsDirective>
                                    <AggregateColumnDirective
                                        field="pesoMateriaPrimaStock"
                                        type={["Sum", "Max"]}
                                        groupCaptionTemplate={this.groupcFootertMax}
                                    >
                                        {' '}
                                    </AggregateColumnDirective>
                                    </AggregateColumnsDirective>
                                </AggregateDirective>
                            </AggregatesDirective>

                            <Inject services={[ Toolbar, ExcelExport, Filter, Sort, Edit, Toolbar, Page, Aggregate, Group, Selection ]} />
                        </GridComponent>                  
                    ) : (
                    <GridComponent
                        id="adaptivedevice"
                        dataSource={this.state.dataMp}
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
                                field="consecutivo"
                                headerText="Consecutivo MP"
                                width="180"
                                isPrimaryKey={true}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="materiaPrima"
                                headerText="Nombre M.P."
                                width="180"
                            />
                            <ColumnDirective
                                field="loteMateriaPrima"
                                headerText="lote MP"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="pesoMateriaPrimaStock"
                                headerText="Peso MP Disponible"
                                width="280"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="pesoBulto"
                                headerText="Peso Bulto MP"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="bultosEstiba"
                                headerText="# Bultos Estivas"
                                width="150"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="fechaEntrada"
                                headerText="Fecha Entrada"
                                width="150"
                                template={this.fechaEntradaTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="fechaVencimiento"
                                headerText="Fecha Vencimiento"
                                width="250"
                                template={this.fechaVencimientoTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                
                                headerText="M.P. Disponible o Vencida"
                                width="240"
                                template={this.mpDiffVencimientoTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="responsableRecepcion"
                                headerText="Responsable Recepcion"
                                width="220"
                            ></ColumnDirective>
                            <ColumnDirective
                                field="tieneExtencionFechaVencimiento"
                                headerText="Tiene Extencion de F.V"
                                width="250"
                                template={this.extencionFechaVencimiento}
                            ></ColumnDirective>
                            </ColumnsDirective>

                            <AggregatesDirective>
                                <AggregateDirective>
                                    <AggregateColumnsDirective>
                                    <AggregateColumnDirective
                                        field="pesoMateriaPrimaStock"
                                        type={["Sum", "Max"]}
                                        groupCaptionTemplate={this.groupcFootertMax}
                                    >
                                        {' '}
                                    </AggregateColumnDirective>
                                    </AggregateColumnsDirective>
                                </AggregateDirective>
                            </AggregatesDirective>

                            <Inject services={[Filter, Sort, Edit, Toolbar, Page, Aggregate, Group]} />
                    </GridComponent>
                    )}
                </div>
                </div>

                <DialogComponent
                    id="AnimationDialog1"
                    isModal={true}
                    showCloseIcon={true}
                    width="500px"
                    beforeOpen={this.onBeforeOpen}
                    header={this.header}
                    visible={this.state.hideDialog}
                    beforeClose={this.dialogClose.bind(this)}
                    footerTemplate={this.footerTemplate.bind(this)} 
                    content={this.content.bind(this)} 
                >       
                </DialogComponent>  

                <DialogComponent
                    id="AnimationDialog2"
                    isModal={true}
                    showCloseIcon={true}
                    width="500px"
                    beforeOpen={this.onBeforeOpen}
                    header={this.headerActualizar}
                    visible={this.state.hideDialogActualizar}
                    beforeClose={this.dialogCloseActualizar.bind(this)}
                    footerTemplate={this.footerTemplateActualizar.bind(this)} 
                    content={this.contentActualizar.bind(this)} 
                >       
                </DialogComponent> 

                {this.pdfDialog()}

            </div>
        );
    }
}

export default SeguimientoInsumos;