package enums

import (
	"fmt"
	"io"
	"strings"
)

type PaymentMethod string

var (
	PaymentMethodUnspecified               PaymentMethod = "UNSPECIFIED"
	PaymentMethodDomesticWireTransfer      PaymentMethod = "DOMESTIC_WIRE_TRANSFER"
	PaymentMethodInternationalWireTransfer PaymentMethod = "INTERNATIONAL_WIRE_TRANSFER"
	PaymentMethodACH                       PaymentMethod = "ACH"
	PaymentMethodCreditCard                PaymentMethod = "CREDIT_CARD"
)

func (p PaymentMethod) Values() (kinds []string) {
	for _, s := range []PaymentMethod{PaymentMethodDomesticWireTransfer, PaymentMethodInternationalWireTransfer, PaymentMethodACH, PaymentMethodCreditCard, PaymentMethodUnspecified} {
		kinds = append(kinds, string(s))
	}

	return
}

func (p PaymentMethod) String() string {
	return string(p)
}

func ToPaymentMethod(r string) *PaymentMethod {
	switch r := strings.ToUpper(r); r {
	case PaymentMethodDomesticWireTransfer.String():
		return &PaymentMethodDomesticWireTransfer
	case PaymentMethodInternationalWireTransfer.String():
		return &PaymentMethodInternationalWireTransfer
	case PaymentMethodACH.String():
		return &PaymentMethodACH
	case PaymentMethodCreditCard.String():
		return &PaymentMethodCreditCard
	default:
		return &PaymentMethodUnspecified
	}
}

func (p PaymentMethod) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + p.String() + `"`))
}

func (p *PaymentMethod) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("wrong type for PaymentMethod, got: %T", v) //nolint:err113
	}
	*p = PaymentMethod(str)
	return nil
}
