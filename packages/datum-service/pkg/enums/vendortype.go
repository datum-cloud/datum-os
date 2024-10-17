package enums

import (
	"fmt"
	"io"
	"strings"
)

type VendorType string

var (
	VendorTypeUnspecified VendorType = "UNSPECIFIED"
	VendorTypePerson      VendorType = "PERSON"
	VendorTypeCorporation VendorType = "CORPORATION"
)

func (VendorType) Values() (kinds []string) {
	for _, s := range []VendorType{VendorTypeUnspecified, VendorTypePerson, VendorTypeCorporation} {
		kinds = append(kinds, string(s))
	}

	return
}

func (r VendorType) String() string {
	return string(r)
}

func (r VendorType) Int() int {
	switch r {
	case VendorTypePerson:
		return 1
	case VendorTypeCorporation:
		return 2
	default:
		return 0
	}
}

func ToVendorTypeFromInt(r int) *VendorType {
	switch r {
	case 1:
		return &VendorTypePerson
	case 2:
		return &VendorTypeCorporation
	default:
		return &VendorTypeUnspecified
	}
}

func ToVendorType(r string) *VendorType {
	switch r := strings.ToUpper(r); r {
	case VendorTypePerson.String():
		return &VendorTypePerson
	case VendorTypeCorporation.String():
		return &VendorTypeCorporation
	default:
		return &VendorTypeUnspecified
	}
}

func (r VendorType) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(`"` + r.String() + `"`))
}

func (r *VendorType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("VendorType must be a string")
	}
	*r = VendorType(str)
	return nil
}
