import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    selectedPacote: [''], // Campo para rastrear o pacote selecionado
  });

  secondFormGroup = this._formBuilder.group({
    selectedItens: this._formBuilder.array([]), // Use um FormArray para rastrear os itens selecionados
  });

  form: FormGroup = new FormGroup({
    selectedOption: new FormControl('') // FormControl para o mat-select
  });

  isEditable = true;
  parcelamento: any;
  valorPacote = 0.00;
  valorPacoteComItens = 0.00;
  valorTotal = 0.0;
  pacoteSelecionado: any;
  itensSelecionados: any;
  formaDePagamento: any;
  valorTotalParcelado: any;
  isStep1Completed = false;
  phoneNumber = '54984272167'

  constructor(
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
    ) {}

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('stepper') stepper!: MatStepper;

  getCurrentStepIndex() {
  return this.stepper.selectedIndex;
}

  ngOnInit(): void {}

  getTabIndex() {
    return this.tabGroup.selectedIndex;
  }

  onSomethingClicked() {
   this.formaDePagamento = this.getTabIndex() == 0 ? 'Dinheiro' : 'Cartão de Crédito';
   this.valorTotal = this.getTabIndex() == 0 ? 'R$' + this.valorPacoteComItens : this.valorTotalParcelado;
  }


  selecionaPacote(pacote: any) {
    this.isStep1Completed = true;
    this.pacoteSelecionado = pacote;
    this.valorPacote = pacote.value;
    this.firstFormGroup.get('selectedPacote')?.setValue(pacote);
  }

  onSelect(event: any){
    this.valorTotalParcelado = 'R$' + event.value.valorTotalParcelado + ' parcelado em ' + event.value.parcela;

  }

  calcularParcelas(valor: number) {
    const taxaParcela6 = 0.08;
    const taxaParcela8 = 0.12;
    const taxaParcela12 = 0.15;

    const parcelas = [
      {
        parcela: '1x de ' + (valor + valor * 0.04).toFixed(2),
        valorTotalParcelado: (valor + valor * 0.04).toFixed(2)
      }
    ];

    for (let parcela = 2; parcela <= 12; parcela++) {
      let valorTotal = valor;
      let valorParcela = 0.0;
      if (parcela <= 6) {
        valorParcela = valor * taxaParcela6;
      }
      if (parcela > 6 && parcela <= 8) {
        valorParcela = valor * taxaParcela8;
      }
      if (parcela > 8 && parcela <= 12) {
        valorParcela = valor * taxaParcela12;
      }
      parcelas.push(
        {
          parcela: parcela + 'x de R$' + ((valor + valorParcela) / parcela).toFixed(2),
          valorTotalParcelado: (valor + valorParcela).toFixed(2),
        }
      );
    }
    this.parcelamento = parcelas;
  }

  onCheckboxChange(item: any){
    if(item.selected){
      item.selected = false;
    }else{
      item.selected = true;
    }
  }

  getSelectedItems() {
    let valor = this.valorPacote;
    const selectedItems = this.listItens.filter((item) => item.selected);
    selectedItems.forEach(item => valor = valor + item.value);
    this.valorPacoteComItens = valor;
    this.calcularParcelas(valor);
    this.itensSelecionados = selectedItems;
  }

  abrirLinkExterno() {
    let urlExterna = this.getWhatsAppLink();
    window.open(urlExterna, '_blank');
  }

  getWhatsAppLink(): string {
    const pacote = this.pacoteSelecionado?.name || 'Pacote não selecionado'; // Se não houver pacote selecionado, exiba uma mensagem padrão
    const itensSelecionados = this.itensSelecionados.map((item: any) => item.name).join(', ');

    const message = `Investimento: ${pacote}\nAdicionais: ${itensSelecionados} \nValor Total: ${this.valorTotal}`;
    const url = `https://api.whatsapp.com/send?phone=${this.phoneNumber}&text=${encodeURIComponent(message)}`;
    return url;
  }

  listPacotes = [
    {
      id: 1,
      name: 'Pacote 01',
      description: [
        '15 Fotos',
        'Todas em arquivos digitais',
        '1 Hora de ensaio (São João da Urtiga - RS)',
      ],
      value: 400.0,
    },
    {
      id: 1,
      name: 'Pacote 02',
      description: [
        '25 Fotos',
        'Todas em arquivos digitais',
        '2 Hora de ensaio',
      ],
      value: 700.0,
    },
    {
      id: 1,
      name: 'Pacote 03',
      description: [
        '35 Fotos',
        'Todas em arquivos digitais',
        '3 Hora de ensaio',
      ],
      value: 1400.0,
    },
  ];

  listItens = [
    {
      id: 1,
      selected: false,
      name: 'Mais 1 Look',
      description: 'Pode adicionar mais 1 look no ensaio',
      value: 25.1,
    },
    {
      id: 2,
      selected: false,
      name: 'Mais 1 Hora de ensaio',
      description: 'Pode adicionar mais 1 hora de ensaio',
      value: 125.0,
    },
    {
      id: 3,
      selected: false,
      name: 'Quadro MDF 30x30',
      description: 'Pode adicionar 1 quadro MDF 30x30',
      value: 200.0,
    },
    {
      id: 4,
      selected: false,
      name: 'Quadro MDF 40x35',
      description: 'Pode adicionar 1 quadro MDF 40x35',
      value: 280.0,
    },
    {
      id: 5,
      selected: false,
      name: 'Alboom 35 laminas',
      description:
        'Pode adicionar 1 Alboom de 35 laminas com capa diagramada e etc ...',
      value: 900.5,
    },
    {
      id: 6,
      selected: false,
      name: 'Make off',
      description: 'receba o acompanhamento durante a maquiagem',
      value: 150.0,
    },
  ];
}

export interface FormaPagamento {
  id: number;
  nome: string;
  descricao: string;
}
