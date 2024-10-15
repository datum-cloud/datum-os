package enums

import (
	"fmt"
	"io"
	"strings"
)

type PhoneNumberType string

var (
	PhoneNumberTypeUnspecified PhoneNumberType = "UNSPECIFIED"
	PhoneNumberTypeE164        PhoneNumberType = "E164"
	PhoneNumberTypeShortCode   PhoneNumberType = "SHORT_CODE"
)

func (PhoneNumberType) Values() (kinds []string) {
	for _, s := range []PhoneNumberType{PhoneNumberTypeE164, PhoneNumberTypeShortCode, PhoneNumberTypeUnspecified} {
		kinds = append(kinds, string(s))
	}

	return
}

func (r PhoneNumberType) String() string {
	return string(r)
}

func ToPhoneNumberType(r string) *PhoneNumberType {
	switch r := strings.ToUpper(r); r {
	case PhoneNumberTypeE164.String():
		return &PhoneNumberTypeE164
	case PhoneNumberTypeShortCode.String():
		return &PhoneNumberTypeShortCode
	default:
		return &PhoneNumberTypeUnspecified
	}
}

func (r PhoneNumberType) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + r.String() + `"`))
}

func (r *PhoneNumberType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("wrong type for PhoneNumberType, got: %T", v) //nolint:err113
	}
	*r = PhoneNumberType(str)
	return nil
}
