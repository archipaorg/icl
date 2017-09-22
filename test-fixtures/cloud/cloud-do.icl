# import configuration file
take cloud-aws
// add block recursivity + name recursive
/* sample of setting inheritance */
variable "digitealocean" from aws.generic {
    key1 = "2",
    key = {key = "val"}

}

/*simple block*/
block_cloud_simple "cloud" {
    sshKey = "",
    sshPassword = ""
}

/*mixin block*/
block_cloud_mixin "cloud" @username, @password {
    sshUsername = @username,
    sshPassword = @password,
    description = "this is my @username and my @password"
}
// call mixin block
block_cloud_mixin "cloud"  apply block_cloud_mixin.cloud @param1="test", @param2=[1,2]
/*
    sample of multiple level of nesting
    with comments ' " @ ! $^
*/
block_inherited "digitealocean" from block_cloud_simple.cloud {
    // simple key/value integer
    keyInteger = 5,
    // simple key/value float
    keyFloat = 6.4,
    // simple key/value single line string
    keyStr = "im a single line string",
    // list of elements
    list  = [
                    1, // integer
                    3.5, // float
                    "simple string", // another string
                    [1,2,3, [1,2,3]], // list of list of list
                    "another string", {key = "12ddàd"}, // list of list of object
                    5 //integer
            ],
    // double quote multiline string
    multilineString = "
            line1
            line2
            line3
    ",
    // single quote multiline string
    multilineString2 = '
            line1
            line2
            line3
    ',
    /*multiline raw data */
    multilineRawData = <<<EOF
            {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Action": [
                    "ec2:Describe*"
                  ],
                  "Effect": "Allow",
                  "Resource": "*"'
                }
              ]
            }
    EOF,
    // boolean key
    keyBoolean = true
}

block_inherited "digitealocean" "droplet" "mini1gb" from cloud.generic.policy {
    key = 1,
    key2 = 3,
    key4 = {},

    block "digital" "policy" "mini1gb" from cloud.generic.policy {
        key = 2,
        block "digital" "policy" "mini1gb" from cloud.generic.policy {
            block "digital" "policy" "mini1gb" from cloud.generic.policy {

            }
        }
    }

    block "digital" "policy" "mini2gb" from cloud.generic.policy {
        block "digital" "policy" "mini1gb" from cloud.generic.policy {

        }
    }

}