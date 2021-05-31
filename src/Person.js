import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import moment from 'moment';
import './Person.css'
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Base64 } from 'js-base64';

export class Person extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedGender: null,
            name: '',
            email: '',
            naturalness: '',
            nationality: '',
            cpf: '',
            date: null,
            gender: [
                {name: 'Masculino', code: 'M'},
                {name: 'Feminino', code: 'F'},
                {name: 'Outro', code: 'O'}
            ],
            cpfError: false
        };

        this.initialState = this.state;

        this.onNameChange = this.onNameChange.bind(this);
    }

    onNameChange(e) {
        this.setState({ selectedGender: e.value });
    }

    createPerson() {
        const name = this.state.name;
        const gender = this.state.selectedGender ? this.state.selectedGender.code : '';
        const email = this.state.email;
        const birthDate = moment(this.state.date);
        const naturalness = this.state.naturalness;
        const nationality = this.state.nationality;
        const cpf = this.state.cpf
            .replaceAll('.','')
            .replace('-','');
        if(!cpf){
            this.toast.show({severity:'error', summary: 'Alerta', detail:'O CPF deve ser informado', life: 5000});
        }else{
            fetch('http://localhost:8080/person/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic'+Base64.encode("myKey:myPass")
                },
                body: JSON.stringify({name, gender, email, cpf, birthDate, naturalness, nationality}),
                })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.errors) {
                        responseJson.errors.forEach(data => {
                            this.toast.show({severity:'error', summary: 'Alerta', detail: data.code, life: 5000});
                        })
                    }
                    if (responseJson.id) {
                        this.toast.show({severity:'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso'});
                        this.reset();
                    }
                })
        }
        // .then(data => {
        //     alert(data);
        // });
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    validateMail(mail) {
        if( mail=="" || mail.indexOf('@')==-1 || mail.indexOf('.')==-1 ){
            this.toast.show({severity:'error', summary: 'Alerta', detail:"Por favor, informe um e-mail válido!", life: 5000});
            return false;
        }
    }
    
    reset(){
        this.setState(this.initialState)
    }

    render() {
        return (
                <div className="card">
                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-6 p-md-4">
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">Nome</span>
                                    <InputText value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
                                </div>
                            </div>

                            <div className="p-field p-col-6 p-md-4">
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">Sexo</span>
                                    <Dropdown className='p-dropdown p-component' value={this.state.selectedGender} options={this.state.gender} onChange={this.onNameChange} optionLabel="name" />
                                </div>
                            </div>

                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">E-mail</span>
                                <InputText value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                                onBlur={(e) => this.validateMail(e.target.value)}
                                />
                                
                            </div>
                        </div>

                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">Data</span>
                                <Calendar value={this.state.date} onChange={(e) => this.setState({date: e.value})} dateFormat='dd/mm/yy' yearNavigator yearRange="1900:2030"></Calendar>
                            </div>
                        </div>

                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">Naturalidade</span>
                                <InputText value={this.state.naturalness}
                                    onChange={(e) => this.setState({naturalness: e.target.value})}
                                />
                            </div>
                        </div>
                        

                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">Nacionalidade</span>
                                <InputText value={this.state.nationality}
                                    onChange={(e) => this.setState({nationality: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">CPF</span>
                                <InputMask mask="999.999.999-99" 
                                    value={this.state.cpf}
                                    placeholder="999.999.999-99" 
                                    onChange={(e) => this.setState({cpf: e.value})}
                                    className={this.state.cpfError ? "p-invalid p-d-block" : ""}
                                    >
                                </InputMask>
                            </div>
                        </div>
                    </div>
                    <span className="p-buttonset">
                        <Button label="Save" icon="pi pi-check" onClick={() => this.createPerson()} />
                        <Button label="Delete" icon="pi pi-trash" />
                        <Button label="Cancel" icon="pi pi-times" onClick={() => this.reset()}/>
                    </span>
                    <Toast ref={(el) => this.toast = el} />
                </div>
        );
    }
}