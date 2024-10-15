package enums

import (
	"fmt"
	"io"
	"strings"
)

type TaxIDType string

var (
	TaxIDTypeUnspecified TaxIDType = "UNSPECIFIED"
	TaxIDTypeSSN         TaxIDType = "SSN"
	TaxIDTypeEIN         TaxIDType = "EIN"
	TaxIDTypeATIN        TaxIDType = "ATIN"
	TaxIDTypeITIN        TaxIDType = "ITIN"
)

func (TaxIDType) Values() (kinds []string) {
	for _, s := range []TaxIDType{TaxIDTypeUnspecified, TaxIDTypeSSN, TaxIDTypeEIN, TaxIDTypeATIN, TaxIDTypeITIN} {
		kinds = append(kinds, string(s))
	}

	return
}

func (r TaxIDType) String() string {
	return string(r)
}

func ToTaxIDType(r string) *TaxIDType {
	switch r := strings.ToUpper(r); r {
	case TaxIDTypeSSN.String():
		return &TaxIDTypeSSN
	case TaxIDTypeEIN.String():
		return &TaxIDTypeEIN
	case TaxIDTypeATIN.String():
		return &TaxIDTypeATIN
	case TaxIDTypeITIN.String():
		return &TaxIDTypeITIN
	default:
		return &TaxIDTypeUnspecified
	}
}

func (r TaxIDType) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + r.String() + `"`))
}

func (r *TaxIDType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("wrong type for TaxIDType, got: %T", v) //nolint:err113
	}

	*r = TaxIDType(str)

	return nil
}
