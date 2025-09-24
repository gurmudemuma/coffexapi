package shared

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type User struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	Organization string `json:"organization"`
	Role         string `json:"role"`
}

type UserManagement struct {
}

func NewUserManagement() *UserManagement {
	return &UserManagement{}
}

func (um *UserManagement) CreateUser(ctx contractapi.TransactionContextInterface, id, username, password, organization, role string) error {
	// In a real application, you would hash the password
	Password := password // For simplicity, we are not hashing the password in this example

	user := User{
		ID:           id,
		Username:     username,
		Password: Password,
		Organization: organization,
		Role:         role,
	}

	userBytes, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %v", err)
	}

	return ctx.GetStub().PutState(fmt.Sprintf("user_%s", username), userBytes)
}

func (um *UserManagement) GetUser(ctx contractapi.TransactionContextInterface, username string) (*User, error) {
	userBytes, err := ctx.GetStub().GetState(fmt.Sprintf("user_%s", username))
	if err != nil {
		return nil, fmt.Errorf("failed to read user from world state: %v", err)
	}
	if userBytes == nil {
		return nil, fmt.Errorf("user %s does not exist", username)
	}

	var user User
	if err := json.Unmarshal(userBytes, &user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %v", err)
	}

	return &user, nil
}
