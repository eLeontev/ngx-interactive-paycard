import { Component, Input } from '@angular/core';
import { CardModel } from './shared/card-model';

@Component({
  selector: 'interactive-paycard',
  templateUrl: 'interactive-paycard.component.html',
  styleUrls: ['./interactive-paycard.component.scss']
})
export class InteractivePaycardComponent {

  @Input() chipImgPath: string;
  @Input() logoImgPath: string;
  @Input() backBgImgPath: string;
  @Input() frontBgImgPath: string;
  @Input() cardNumberFormat: string;
  @Input() cardNumberMask: string;

  cardModel: CardModel = { cardNumber: '', cardName: '', expirationMonth: '', expirationYear: '', cvv: '' };
  isCardNumberMasked = true;
  isCvvFocused = false;

  cardNumberMaxLength = 19;
  minCardYear = new Date().getFullYear();
  displayedCardNumber = this.cardModel.cardNumber; // The displayedCardNumber can be masked, the cardModel.cardNumber contains the real data

  cardNumberId = 'cardNumberId';
  cardNameId = 'cardNameId';
  monthSelect = 'monthSelect';
  yearSelectId = 'yearSelectId';
  cardCvvId = 'cardCvvId';

  onCardNumberChange($event): void {
    let cardNumber: string = $event.target.value;
    this.cardNumberMaxLength = this.cardNumberFormat.length;

    let newValues = [];
    let letterRegex = new RegExp('[^0-9]');
    cardNumber.split('').forEach((element, index) => {
      if (this.cardNumberFormat[index] == ' ' && element != ' ' && !(letterRegex.test(element))) {
        // if the typed number is at the border of a space, the space has to be added and the number itself
        newValues.push(' ');
        newValues.push(element);
      } else if (this.cardNumberFormat[index] == ' ' && element == ' ') { 
        // if there is already a space in the number and in the placeholder, a space is needed
        newValues.push(' ');
      }
      else if (!(letterRegex.test(element))) { 
        // only numbers are allowed
        newValues.push(element);
      }
    });
    cardNumber = newValues.join('').trim();

    this.displayedCardNumber = cardNumber;
    this.cardModel.cardNumber = cardNumber;
    $event.target.value = cardNumber; // The value in event has to be updated, otherwise the letter remains in the <input>
  }

  onCardNumberFocus(): void {
    this.unMaskCardNumber();
  }

  onCardNumberBlur(): void {
    if (this.isCardNumberMasked) {
      this.maskCardNumber();
    }
  }

  onCvvBlur(): void {
    this.isCvvFocused = false;
  }

  onCvvFocus(): void {
    this.isCvvFocused = true;
  }

  onCardNameKeyPress($event): boolean {
    return (($event.charCode >= 65 && $event.charCode <= 90) || ($event.charCode >= 97 && $event.charCode <= 122) || ($event.charCode == 32));
  }

  onToggleCardNumberMask(): void {
    this.isCardNumberMasked = !this.isCardNumberMasked;
    if (this.isCardNumberMasked) {
      this.maskCardNumber();
    } else {
      this.unMaskCardNumber();
    }
  }

  onYearChange(): void {
    if (this.cardModel.expirationYear === this.minCardYear.toString()) {
      this.cardModel.expirationMonth = '';
    }
  }

  minCardMonth(): number {
    if (this.cardModel.expirationYear === this.minCardYear.toString()) {
      return new Date().getMonth() + 1;
    } else {
      return 1;
    }
  }

  generateMonthValue(index: number): string {
    return index < 10 ? `0${index}` : index.toString();
  }

  private maskCardNumber(): void {
    this.cardModel.cardNumber = this.displayedCardNumber;
    let arr = this.displayedCardNumber.split('');
    arr.forEach((element, index) => {
      /*if (index > 4 && index < 14 && element.trim() !== '') {
        arr[index] = '*';
      }*/
      if(this.cardNumberMask[index]=='*') {
          arr[index]='*';
      }
    })
    this.displayedCardNumber = arr.join('');
  }

  private unMaskCardNumber(): void {
    this.displayedCardNumber = this.cardModel.cardNumber;
  }

}
